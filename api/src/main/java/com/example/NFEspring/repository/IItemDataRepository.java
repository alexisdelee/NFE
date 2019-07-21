package com.example.NFEspring.repository;

import com.example.NFEspring.entity.ItemData;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IItemDataRepository extends Repository<ItemData, Integer> {

    @Transactional(readOnly = true)
    @Query("select data from ItemData data where data.item.id = :itemId and data.ticket.id = :ticketId")
    Optional<ItemData> findByItemIdAndTicketId(@Param("itemId") Integer itemId, @Param("ticketId") Integer ticketId);

}
