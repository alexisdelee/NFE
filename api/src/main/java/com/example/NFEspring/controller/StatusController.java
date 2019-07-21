package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Status;
import com.example.NFEspring.repository.IStatusRepository;
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
@RequestMapping("/status")
public class StatusController extends ABaseController {

    @Autowired
    private IStatusRepository status;

    @GetMapping("/{statusId}")
    public ResponseEntity<?> findById(@PathVariable("statusId") int statusId) throws NoSuchFieldException {
        Optional<Status> status = this.status.findById(statusId);
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap(
                        "category",
                        status.orElseThrow(() -> new NoSuchFieldException("Status with ID " + statusId + " not found"))
                ));
    }

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        Collection<Status> status = this.status.findAll();
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("status", status));
    }

}
