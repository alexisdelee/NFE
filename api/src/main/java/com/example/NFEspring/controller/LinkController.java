package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Link;
import com.example.NFEspring.repository.ILinkRepository;
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
@RequestMapping("/links")
public class LinkController extends ABaseController {

    @Autowired
    private ILinkRepository links;

    @GetMapping("/{linkId}")
    public ResponseEntity<?> findById(@PathVariable("linkId") int linkId) throws NoSuchFieldException {
        Optional<Link> link = this.links.findById(linkId);
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap(
                        "link",
                        link.orElseThrow(() -> new NoSuchFieldException("Link with ID " + linkId + " not found"))
                ));
    }

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        Collection<Link> links = this.links.findAll();
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("links", links));
    }

}

