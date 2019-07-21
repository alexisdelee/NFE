package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Assignee;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Repository
public interface IAssigneeRepository extends Repository<Assignee, Integer> {

    @Transactional
    @Modifying
    @Query("delete from Assignee assignee where assignee.ticket.id = :ticketId")
    void eraseByTicketId(@Param("ticketId") int ticketId);

}
