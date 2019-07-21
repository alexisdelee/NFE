package com.example.NFEspring.repository;

import com.example.NFEspring.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@org.springframework.stereotype.Repository
public interface IHistoryRepository extends Repository<History, Integer> {

    @Transactional(readOnly = true)
    @Query("select history from History history where history.ticket.id = :ticketId order by history.created desc")
    Collection<History> findAllByTicketId(@Param("ticketId") Integer ticketId);

    Collection<History> saveAll(Iterable<History> histories);

}
