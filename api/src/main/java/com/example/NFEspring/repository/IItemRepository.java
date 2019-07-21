package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Item;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@org.springframework.stereotype.Repository
public interface IItemRepository extends Repository<Item, Integer> {

    @Transactional(readOnly = true)
    @Query("select item from Item item where item.tracker.id = :trackerId")
    Collection<Item> findByTrackerId(@Param("trackerId") Integer trackerId);

}
