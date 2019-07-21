package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Tracker;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface ITrackerRepository extends Repository<Tracker, Integer> {

    @Transactional(readOnly = true)
    Optional<Tracker> findById(Integer trackerId);

    @Transactional(readOnly = true)
    Optional<Tracker> findByShortname(String shortname);

    @Transactional(readOnly = true)
    @Query("select tracker from Tracker tracker")
    Collection<Tracker> findAll();

}
