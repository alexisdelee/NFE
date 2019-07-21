package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Item;
import com.example.NFEspring.repository.IItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.NFEspring.utils.SerializableUtils;

import java.util.Collection;

@RestController
@RequestMapping("/items")
public class ItemController {

    @Autowired
    private IItemRepository items;

    @GetMapping("/trackers/{trackerId}")
    public ResponseEntity<?> findById(@PathVariable("trackerId") int trackerId) {
        Collection<Item> items = this.items.findByTrackerId(trackerId);

        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("items", items));
    }

}
