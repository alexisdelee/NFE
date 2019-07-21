package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Status;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IStatusRepository extends Repository<Status, Integer> {

    @Transactional(readOnly = true)
    Optional<Status> findById(Integer statusId);

    @Transactional(readOnly = true)
    Optional<Status> findByShortname(String shortname);

    @Transactional(readOnly = true)
    @Query("select status from Status status")
    Collection<Status> findAll();

}
