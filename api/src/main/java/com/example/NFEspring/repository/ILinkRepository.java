package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Link;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface ILinkRepository extends Repository<Link, Integer> {

    @Transactional(readOnly = true)
    Optional<Link> findById(Integer ticketId);

    @Transactional(readOnly = true)
    @Query("select link from Link link")
    Collection<Link> findAll();

}
