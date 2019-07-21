package com.example.NFEspring.controller;

import com.example.NFEspring.entity.History;
import com.example.NFEspring.repository.IHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.NFEspring.utils.SerializableUtils;

import java.util.Collection;

@RestController
@RequestMapping("/histories")
public class HistoryController extends ABaseController {

    @Autowired
    private IHistoryRepository histories;

    @GetMapping("/{ticketId}")
    public ResponseEntity<?> findByTicketId(@PathVariable("ticketId") int ticketId) {
        Collection<History> histories = this.histories.findAllByTicketId(ticketId);
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("histories", histories));
    }

}
