package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Priority;
import com.example.NFEspring.repository.IPriorityRepository;
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
@RequestMapping("/priorities")
public class PriorityController extends ABaseController {

    @Autowired
    private IPriorityRepository priorities;

    @GetMapping("/{priorityId}")
    public ResponseEntity<?> findById(@PathVariable("priorityId") int priorityId) throws NoSuchFieldException {
        Optional<Priority> priority = this.priorities.findById(priorityId);
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap(
                        "priority",
                        priority.orElseThrow(() -> new NoSuchFieldException("Priority with ID " + priorityId + " not found"))
                ));
    }

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        Collection<Priority> priorities = this.priorities.findAll();
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("priorities", priorities));
    }

}
