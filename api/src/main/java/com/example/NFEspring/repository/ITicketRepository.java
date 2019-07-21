package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Ticket;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

@org.springframework.stereotype.Repository
public interface ITicketRepository extends Repository<Ticket, Integer> {

    // @Transactional(readOnly = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Query("select ticket from Ticket ticket where ticket.id = :ticketId and ticket.deleted = false")
    Optional<Ticket> findById(@Param("ticketId") Integer ticketId);

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.region is not null and ticket.deleted = false")
    Collection<Ticket> findByRegion();

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.region.id in :regionIds and ticket.deleted = false")
    Collection<Ticket> findByRegionIds(@Param("regionIds") Set<Integer> regionIds);

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.tracker is not null and ticket.deleted = false")
    Collection<Ticket> findByTracker();

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.tracker.id in :trackerIds and ticket.deleted = false")
    Collection<Ticket> findByTrackerIds(@Param("trackerIds") Set<Integer> trackerIds);

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.priority is not null and ticket.deleted = false")
    Collection<Ticket> findByPriority();

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.priority.id in :priorityIds and ticket.deleted = false")
    Collection<Ticket> findByPriorityIds(@Param("priorityIds") Set<Integer> priorityIds);

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.status is not null and ticket.deleted = false")
    Collection<Ticket> findByStatus();

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.status.id in :statusIds and ticket.deleted = false")
    Collection<Ticket> findByStatusIds(@Param("statusIds") Set<Integer> statusIds);

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.reporter is not null and ticket.deleted = false")
    Collection<Ticket> findByReporter();

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.reporter.id in :reporterIds and ticket.deleted = false")
    Collection<Ticket> findByReporterIds(@Param("reporterIds") Set<Integer> reporterIds);

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket join Assignee assignee on assignee.ticket.id = ticket.id where ticket.deleted = false group by ticket.id")
    Collection<Ticket> findByAssignee();

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket join Assignee assignee on assignee.ticket.id = ticket.id and assignee.user.id in :assigneeIds where ticket.deleted = false")
    Collection<Ticket> findByAssigneeIds(@Param("assigneeIds") Set<Integer> assigneeIds);

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.deleted = false")
    Collection<Ticket> findAll();

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.created >= :startDate and ticket.created <= :endDate")
    Collection<Ticket> findAllWithPeriode(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Transactional(readOnly = true)
    @Query("select ticket from Ticket ticket where ticket.id in :ticketIds and ticket.deleted = false")
    Collection<Ticket> findAllIds(@Param("ticketIds") Set<Integer> ticketIds);

    Ticket save(Ticket ticket);

    @Transactional
    @Modifying
    @Query("update Ticket ticket set ticket.deleted = true where ticket.id = :ticketId and ticket.archived = false")
    void eraseById(@Param("ticketId") int ticketId);

}
