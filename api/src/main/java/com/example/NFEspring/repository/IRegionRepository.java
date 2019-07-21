package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Region;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IRegionRepository extends Repository<Region, Integer> {

    @Transactional(readOnly = true)
    Optional<Region> findById(Integer regionId);

    @Transactional(readOnly = true)
    Optional<Region> findByPostal(String postal);

    @Transactional(readOnly = true)
    @Query("select region from Region region")
    Collection<Region> findAll();

}
