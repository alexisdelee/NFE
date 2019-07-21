package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Tracker;
import com.example.NFEspring.repository.ITrackerRepository;
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
@RequestMapping("/trackers")
public class TrackerController extends ABaseController {

    @Autowired
    private ITrackerRepository trackers;

    @GetMapping("/{trackerId}")
    public ResponseEntity<?> findById(@PathVariable("trackerId") int trackerId) throws NoSuchFieldException {
        Optional<Tracker> tracker = this.trackers.findById(trackerId);
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap(
                        "category",
                        tracker.orElseThrow(() -> new NoSuchFieldException("Tracker with ID " + trackerId + " not found"))
                ));
    }

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        Collection<Tracker> trackers = this.trackers.findAll();
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("trackers", trackers));
    }

}
