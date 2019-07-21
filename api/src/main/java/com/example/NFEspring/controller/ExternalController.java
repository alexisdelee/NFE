package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Item;
import com.example.NFEspring.entity.ItemData;
import com.example.NFEspring.entity.Region;
import com.example.NFEspring.entity.Ticket;
import com.example.NFEspring.repository.*;
import com.example.NFEspring.utils.SerializableUtils;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/externals")
public class ExternalController extends ABaseController {

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

    @PostMapping("/incident")
    public ResponseEntity<?> saveExternalIncident(@RequestBody ObjectNode objectNode) throws NoSuchFieldException {
        double latitude = objectNode.get("coordinates").get("latitude").asDouble();
        double longitude = objectNode.get("coordinates").get("longitude").asDouble();
        int regionId = objectNode.get("region").get("id").asInt();
        String client = objectNode.get("name").asText();
        String phone = objectNode.get("phone").asText();
        String email = objectNode.get("mail").asText();
        String comment = objectNode.get("comment").asText();

        Ticket ticket = new Ticket();

        ticket.setId(null);
        ticket.setSummary("[système] " + client);
        ticket.setDescription(comment.getBytes());

        ticket.setRegion(
                this.regions.findById(regionId)
                        .orElseThrow(() -> new NoSuchFieldException("Region with ID " + regionId + " not found")));
        ticket.setTracker(this.trackers.findByShortname("incident").orElseThrow(InternalError::new));
        ticket.setPriority(this.priorities.findByShortname("major").orElseThrow(InternalError::new));
        ticket.setStatus(this.status.findByShortname("do").orElseThrow(InternalError::new));
        ticket.setReferents(Collections.emptySet());
        ticket.setReferences(Collections.emptySet());

        ticket.setAssignees(Collections.emptySet());
        ticket.setReporter(this.users.findByPseudo("system").orElseThrow(InternalError::new));

        // Gestion des items
        Collection<Item> items = this.items.findByTrackerId(ticket.getTracker().getId());
        Set<ItemData> temporalData = new HashSet<>();

        for (Item item: items) {
            ItemData data = new ItemData();

            switch (item.getLabel()) {
                case "Dégradations visibles":
                    data.setValue(""); // à remplir plus tard
                    break;
                case "Nom du client":
                    data.setValue(client);
                    break;
                case "Numéro de téléphone":
                    data.setValue(phone);
                    break;
                case "Mail de contact":
                    data.setValue(email);
                    break;
                case "Localisation":
                    data.setValue(latitude + "@" + longitude);
                    break;
            }

            data.setIteration(1);
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

    @GetMapping("/regions")
    public ResponseEntity<?> findAll() {
        Collection<Region> regions = this.regions.findAll();
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("regions", regions));
    }

}
