package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Category;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface ICategoryRepository extends Repository<Category, Integer> {

    @Transactional(readOnly = true)
    Optional<Category> findById(Integer categoryId);

    @Transactional(readOnly = true)
    @Query("select category from Category category")
    Collection<Category> findAll();

}
