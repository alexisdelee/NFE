package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Category;
import com.example.NFEspring.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.NFEspring.utils.SerializableUtils;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController extends ABaseController {

    @Autowired
    private ICategoryRepository categories;

    @GetMapping("/{categoryId}")
    public ResponseEntity<?> findById(@PathVariable("categoryId") int categoryId) throws NoSuchFieldException {
        Optional<Category> category = this.categories.findById(categoryId);
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap(
                        "category",
                        category.orElseThrow(() -> new NoSuchFieldException("Category with ID " + categoryId + " not found"))
                ));
    }

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        Collection<Category> categories = this.categories.findAll();
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("categories", categories));
    }

}
