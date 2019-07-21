package com.example.NFEspring.repository;

import com.example.NFEspring.entity.LinkTicket;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Repository
public interface ILinkTicketRepository extends Repository<LinkTicket, Integer> {

    @Transactional
    @Modifying
    @Query("delete from LinkTicket linkTicket where linkTicket.referent.id = :referentId")
    void eraseByReferentId(@Param("referentId") int referentId);

    @Transactional
    @Modifying
    @Query("delete from LinkTicket linkTicket where linkTicket.reference.id = :referenceId")
    void eraseByReferenceId(@Param("referenceId") int referenceId);

}
