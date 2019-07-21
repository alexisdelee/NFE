package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Priority;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IPriorityRepository extends Repository<Priority, Integer> {

    @Transactional(readOnly = true)
    Optional<Priority> findById(Integer priorityId);

    @Transactional(readOnly = true)
    Optional<Priority> findByShortname(String shortname);

    @Transactional(readOnly = true)
    @Query("select priority from Priority priority")
    Collection<Priority> findAll();

}
