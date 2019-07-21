package com.example.NFEspring.controller;

import com.example.NFEspring.entity.*;
import com.example.NFEspring.provider.HistoryProvider;
import com.example.NFEspring.repository.*;
import com.example.NFEspring.thread.TenantThread;
import com.sun.jdi.InternalException;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import com.example.NFEspring.utils.JwtUtils;
import com.example.NFEspring.utils.SerializableUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tickets")
public class TicketController extends ABaseController {

    @Autowired
    private ITicketRepository tickets;
    @Autowired
    private IRegionRepository regions;
    @Autowired
    private ITrackerRepository trackers;
    @Autowired
    private IPriorityRepository priorities;
    @Autowired
    private IStatusRepository status;
    @Autowired
    private IUserRepository users;
    @Autowired
    private IAssigneeRepository assignees;
    @Autowired
    private ILinkRepository links;
    @Autowired
    private ILinkTicketRepository linkTickets;
    @Autowired
    private IItemRepository items;
    @Autowired
    private IItemDataRepository itemData;

    @GetMapping("/{ticketId}")
    public ResponseEntity<?> findById(@PathVariable("ticketId") int ticketId) throws NotFoundException {
        Ticket ticket = this.tickets
                .findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket with ID " + ticketId + " not found"));

        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("ticket", ticket));
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(@RequestParam("resource") Optional<String> resource, @RequestParam("resourceId") Optional<String> resourceId) throws NoSuchFieldException {
        Collection<Ticket> tickets;

        Optional<Set<Integer>> ids = Optional.empty();
        if (resourceId.isPresent()) {
            ids = Optional.of(
                    Set.of(
                            resourceId.get().split(",")
                    ).stream().map(Integer::valueOf).collect(Collectors.toSet())
            );
        }

        if (resource.isPresent()) {
            switch (resource.get()) {
                case "region":
                    tickets = ids.isPresent() ? this.tickets.findByRegionIds(ids.get()) : this.tickets.findByRegion();
                    break;
                case "tracker":
                    tickets = ids.isPresent() ? this.tickets.findByTrackerIds(ids.get()) : this.tickets.findByTracker();
                    break;
                case "priority":
                    tickets = ids.isPresent() ? this.tickets.findByPriorityIds(ids.get()) : this.tickets.findByPriority();
                    break;
                case "status":
                    tickets = ids.isPresent() ? this.tickets.findByStatusIds(ids.get()) : this.tickets.findByStatus();
                    break;
                case "reporter":
                    tickets = ids.isPresent() ? this.tickets.findByReporterIds(ids.get()) : this.tickets.findByReporter();
                    break;
                case "assignee":
                    tickets = ids.isPresent() ? this.tickets.findByAssigneeIds(ids.get()) : this.tickets.findByAssignee();
                    break;
                default:
                    throw new NoSuchFieldException("Resource <" + resource.get() + "> not known");
            }
        } else {
            tickets = ids.isPresent() ? this.tickets.findAllIds(ids.get()) : this.tickets.findAll();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SerializableUtils.singletonMap("tickets", tickets));
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Ticket rawTicket, HttpServletRequest request, HttpServletResponse response) throws NoSuchFieldException {
        Ticket ticket = new Ticket();

        ticket.setId(null);
        ticket.setSummary(rawTicket.getSummary());
        ticket.setDescription(rawTicket.getDescription());

        ticket.setRegion(
                this.regions.findById(
                        Optional.ofNullable(rawTicket.getRegion())
                                .orElseThrow(() -> new NoSuchFieldException("Region not found"))
                                .getId()
                ).orElseThrow(() -> new NoSuchFieldException("Region with ID " + rawTicket.getRegion().getId() + " not found")));
        ticket.setTracker(
                this.trackers.findById(
                        Optional.ofNullable(rawTicket.getTracker())
                                .orElseThrow(() -> new NoSuchFieldException("Type not found"))
                                .getId()
                ).orElseThrow(() -> new NoSuchFieldException("Type with ID " + rawTicket.getTracker().getId() + " not found")));
        ticket.setPriority(
                this.priorities.findById(
                        Optional.ofNullable(rawTicket.getPriority())
                                .orElseThrow(() -> new NoSuchFieldException("Priority not found"))
                                .getId()
                ).orElseThrow(() -> new NoSuchFieldException("Priority with ID " + rawTicket.getPriority().getId() + " not found")));
        ticket.setStatus(
                this.status.findById(
                        Optional.ofNullable(rawTicket.getStatus())
                                .orElseThrow(() -> new NoSuchFieldException("Status not found"))
                                .getId()
                ).orElseThrow(() -> new NoSuchFieldException("Status with ID " + rawTicket.getStatus().getId() + " not found")));
        ticket.setReferents(Collections.emptySet());
        ticket.setReferences(Collections.emptySet());

        ticket.setAssignees(Collections.emptySet());
        ticket.setReporter(
                this.users.findById(
                        JwtUtils.getUserId(request.getAttribute("claims"))
                ).orElseThrow(() -> new NoSuchFieldException("Reporter with ID " + JwtUtils.getUserId(request.getAttribute("claims")) + " not found"))
        );

        // Gestion des items
        Collection<Item> items = this.items.findByTrackerId(ticket.getTracker().getId());
        Set<ItemData> temporalData = new HashSet<>();
        for (Item item: items) {
            ItemData data = new ItemData();
            Optional<ItemData> oRawData = rawTicket.getData().stream()
                    .filter(d -> d.getItem().getId().equals(item.getId()))
                    .findFirst();
            if (oRawData.isPresent()) {
                ItemData rawData = oRawData.get();

                if (item.isRequired()) {
                    if (rawData.getValue() == null) {
                        throw new InternalException("Internal error: item <" + item.getLabel() + "> is required");
                    } else if (item.getUniversal().getCategory().equalsIgnoreCase("input") && item.getUniversal().getLabel().equalsIgnoreCase("checkbox")) {
                        if (rawData.getValue().equalsIgnoreCase("0")) {
                            throw new InternalException("Internal error: item <" + item.getLabel() + "> is required");
                        }
                    } else if (rawData.getValue().trim().isEmpty()) {
                        throw new InternalException("Internal error: item <" + item.getLabel() + "> is required");
                    }
                }

                data.setValue(rawData.getValue());
                data.setIteration(1);
            } else {
                data.setValue(item.getUniversal().getDefaultValue());
                data.setIteration(0);
            }

            data.setItem(item);
            data.setTicket(ticket);

            temporalData.add(data);
        }

        ticket.setData(temporalData);

        ticket.setDeleted(false);
        ticket.setArchived(false);
        ticket.setCreated(new Date());
        ticket.setUpdated(null);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(SerializableUtils.singletonMap("ticket", this.tickets.save(ticket)));
    }

    @PutMapping("/{ticketId}")
    public ResponseEntity<?> update(@PathVariable("ticketId") int ticketId, @RequestBody Ticket rawTicket, HttpServletRequest request, HttpServletResponse response) throws NotFoundException, NoSuchFieldException {
        Ticket ticket = this.tickets
                .findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket with ID " + ticketId + " not found"));

        if (ticket.isArchived()) {
            throw new RuntimeException("Forbidden: ticket with ID " + ticketId + " is archived");
        }

        ticket.setSummary(rawTicket.getSummary());
        ticket.setDescription(rawTicket.getDescription());

        ticket.setPriority(
                this.priorities.findById(rawTicket.getPriority().getId())
                        .orElseThrow(() -> new NoSuchFieldException("Priority with ID " + rawTicket.getPriority().getId() + " not found")));
        ticket.setStatus(
                this.status.findById(rawTicket.getStatus().getId())
                        .orElseThrow(() -> new NoSuchFieldException("Status with ID " + rawTicket.getStatus().getId() + " not found")));

        this.assignees.eraseByTicketId(ticketId); // delete all currents assignees
        ticket.setAssignees(
                rawTicket.getAssignees()
                        .stream().peek(assignee -> assignee.setId(null)) // modify ID to avoid conflict
                        .filter(assignee -> assignee.getTicket().getId() == ticketId)
                        .collect(Collectors.toSet())
        ); // then assign new assignees

        this.linkTickets.eraseByReferentId(ticketId);
        ticket.setReferents(
                rawTicket.getReferents()
                        .stream().filter(linkTicket -> linkTicket.getReferent().getId() == ticketId && linkTicket.getReference().getId() != ticketId)
                        .peek(linkTicket -> linkTicket.setId(null))
                        .collect(Collectors.toSet())
        );

        this.linkTickets.eraseByReferenceId(ticketId);
        ticket.setReferences(
                rawTicket.getReferences()
                        .stream().filter(linkTicket -> linkTicket.getReference().getId() == ticketId && linkTicket.getReferent().getId() != ticketId)
                        .peek(linkTicket -> linkTicket.setId(null))
                        .collect(Collectors.toSet())
        );

        // Gestion des items
        Collection<Item> items = this.items.findByTrackerId(ticket.getTracker().getId());
        Set<ItemData> temporalData = new HashSet<>();
        for (Item item: items) {
            ItemData defaultData = new ItemData();
            defaultData.setValue(item.getUniversal().getDefaultValue());
            defaultData.setIteration(0);
            defaultData.setItem(item);
            defaultData.setTicket(ticket);

            ItemData data = this.itemData.findByItemIdAndTicketId(item.getId(), ticket.getId())
                    .orElse(defaultData);

            Optional<ItemData> oRawData = rawTicket.getData().stream()
                    .filter(d -> d.getItem().getId().equals(item.getId()))
                    .findFirst();
            if (oRawData.isPresent()) {
                ItemData rawData = oRawData.get();

                if (item.isReadonly()) {
                    continue;
                } else if (item.isRequired()) {
                    if (rawData.getValue() == null) {
                        throw new InternalException("Internal error: item <" + item.getLabel() + "> is required");
                    } else if (item.getUniversal().getCategory().equalsIgnoreCase("input") && item.getUniversal().getLabel().equalsIgnoreCase("checkbox")) {
                        if (rawData.getValue().equalsIgnoreCase("0")) {
                            throw new InternalException("Internal error: item <" + item.getLabel() + "> is required");
                        }
                    } else if (rawData.getValue().trim().isEmpty()) {
                        throw new InternalException("Internal error: item <" + item.getLabel() + "> is required");
                    }
                }

                data.setValue(rawData.getValue());
                data.setIteration(data.getIteration() + 1);
                data.setItem(item);
                data.setTicket(ticket);
            }

            temporalData.add(data);
        }

        ticket.setData(temporalData);

        ticket.setArchived(rawTicket.isArchived());
        ticket.setUpdated(new Date());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SerializableUtils.singletonMap("ticket", this.tickets.save(ticket)));
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<?> remove(@PathVariable("ticketId") int ticketId) throws NotFoundException, RuntimeException {
        Ticket ticket = this.tickets
                .findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket with ID " + ticketId + " not found"));

        if (ticket.isArchived()) {
            throw new RuntimeException("Forbidden: ticket with ID " + ticketId + " is archived");
        }

        this.tickets.eraseById(ticketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SerializableUtils.emptyMap());
    }

}
