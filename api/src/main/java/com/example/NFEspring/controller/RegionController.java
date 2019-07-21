package com.example.NFEspring.controller;

import com.example.NFEspring.entity.Region;
import com.example.NFEspring.repository.IRegionRepository;
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
@RequestMapping("/regions")
public class RegionController extends ABaseController {

    @Autowired
    private IRegionRepository regions;

    @GetMapping("/{regionId}")
    public ResponseEntity<?> findById(@PathVariable("regionId") int regionId) throws NoSuchFieldException {
        Optional<Region> region = this.regions.findById(regionId);
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap(
                        "category",
                        region.orElseThrow(() -> new NoSuchFieldException("Region with ID " + regionId + " not found"))
                ));
    }

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        Collection<Region> regions = this.regions.findAll();
        return ResponseEntity
                .ok()
                .body(SerializableUtils.singletonMap("regions", regions));
    }

}
