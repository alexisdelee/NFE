package com.example.NFEspring.listener;

import com.example.NFEspring.entity.*;
import com.example.NFEspring.provider.HistoryProvider;
import com.example.NFEspring.repository.IHistoryRepository;
import com.example.NFEspring.repository.ITicketRepository;
import com.example.NFEspring.thread.TenantThread;
import com.example.NFEspring.utils.BeanUtility;
import com.example.NFEspring.utils.JwtUtils;
import com.example.NFEspring.utils.SerializableUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class TicketListener {

    @PersistenceContext
    private EntityManager entityManager;

    @PostPersist
    public void afterInsert(final Ticket ticket) {
        Collection<History> histories = this.save(ticket);
        if (histories.size() > 0) {
            IHistoryRepository historyRepository = (IHistoryRepository) BeanUtility.getBean("IHistoryRepository");
            historyRepository.saveAll(histories);
        }
    }

    @PostUpdate
    // @Transactional(propagation = Propagation.NEVER)
    public void afterUpdate(final Ticket ticket) {
        ITicketRepository tickets = (ITicketRepository) BeanUtility.getBean("ITicketRepository");
        Optional<Ticket> optionalTicket = tickets.findById(ticket.getId());
        if (optionalTicket.isPresent()) {
            Ticket previousTicket = optionalTicket.get();

            Collection<History> histories = this.save(ticket, previousTicket);
            if (histories.size() > 0) {
                IHistoryRepository historyRepository = (IHistoryRepository) BeanUtility.getBean("IHistoryRepository");
                historyRepository.saveAll(histories);
            }
        }
    }

    private Collection<History> save(Ticket ticket, Ticket previousTicket) {
        Optional<Integer> userId = Optional.ofNullable(TenantThread.getThreadLocal())
                .map(JwtUtils::getUserId);
        if (!userId.isPresent()) { // on désactive le data-tracking quand le système enregistre un ticket
            return Collections.emptyList();
        }

        HistoryProvider historyProvider = new HistoryProvider(userId.get(), ticket.getId());

        /* Other */
        historyProvider.addEntry(null, "titre",
                ticket.getSummary(),
                Optional.ofNullable(previousTicket).map(Ticket::getSummary).orElse(null));

        historyProvider.addEntry(null, "description",
                Optional.ofNullable(ticket.getDescription())
                        .map(String::new)
                        .orElse(null),
                Optional.ofNullable(previousTicket)
                        .map(Ticket::getDescription)
                        .map(String::new)
                        .orElse(null)
        );

        historyProvider.addEntry(null, "archivé",
                String.valueOf(ticket.isArchived()),
                Optional.ofNullable(previousTicket)
                        .map(Ticket::isArchived)
                        .map(String::valueOf)
                        .orElse(null));

        /* Resource */
        historyProvider.addEntry("resource", "région",
                ticket.getRegion().getName(),
                Optional.ofNullable(previousTicket)
                        .map(Ticket::getRegion)
                        .map(Region::getName)
                        .orElse(null));

        historyProvider.addEntry("resource", "ajouté par",
                ticket.getReporter().getPseudo(),
                Optional.ofNullable(previousTicket)
                        .map(Ticket::getReporter)
                        .map(User::getPseudo)
                        .orElse(null)
        );

        /* historyProvider.addEntry("resource", "assigné(s) à",
                StringUtils.collectionToDelimitedString(
                        ticket.getAssignees()
                                .stream()
                                .filter(assignee ->
                                        Optional.ofNullable(previousTicket)
                                                .map(Ticket::getAssignees)
                                                .filter(ass -> ass.contains(assignee))
                                                .orElse(Collections.emptySet())
                                                .size() != 0)
                                .map(assignee -> assignee.getUser().getPseudo())
                                .collect(Collectors.toList()), ", "),
                StringUtils.collectionToDelimitedString(
                        Optional.ofNullable(previousTicket)
                                .map(Ticket::getAssignees)
                                .orElse(Collections.emptySet())
                                .stream()
                                .map(assignee -> assignee.getUser().getPseudo())
                                .collect(Collectors.toList()), ", ")
        ); */

        /* Detail */
        historyProvider.addEntry("detail", "type",
                ticket.getTracker().getName(),
                Optional.ofNullable(previousTicket)
                        .map(Ticket::getTracker)
                        .map(Tracker::getName)
                        .orElse(null)
        );

        historyProvider.addEntry("detail", "priorité",
                ticket.getPriority().getName(),
                Optional.ofNullable(previousTicket)
                        .map(Ticket::getPriority)
                        .map(Priority::getName)
                        .orElse(null)
        );

        historyProvider.addEntry("detail", "statut",
                ticket.getStatus().getName(),
                Optional.ofNullable(previousTicket)
                        .map(Ticket::getStatus)
                        .map(Status::getName)
                        .orElse(null)
        );

        /* Custom detail */
        for (ItemData data: ticket.getData()) {
            List<ItemData> previousData = Optional.ofNullable(previousTicket)
                    .map(Ticket::getData)
                    .map(ArrayList::new)
                    .orElse(new ArrayList<>());

            historyProvider.addEntry("custom-detail", data.getItem().getLabel(),
                    data.getValue(),
                    previousData.stream()
                            .filter(itemData -> itemData.getId().equals(data.getId()))
                            .findFirst()
                            .map(ItemData::getValue)
                            .orElse(null)
            );
        }

        return historyProvider.getHistories();
    }

    private Collection<History> save(Ticket ticket) {
        return this.save(ticket, null);
    }

}
