package com.example.NFEspring.controller;

import com.example.NFEspring.repository.ITicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.NFEspring.utils.SerializableUtils;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@RequestMapping("/statistics")
public class StatisticController extends ABaseController {

    @Autowired
    private ITicketRepository tickets;

    @GetMapping("/duration")
    public ResponseEntity<?> findWithDuration(@RequestParam("type-duration") String typeDuration) throws NoSuchFieldException {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate;

        switch(typeDuration) {
            case "past-24-hours":
                startDate = endDate.minusDays(1);
                break;
            case "past-3-days":
                startDate = endDate.minusDays(3);
                break;
            case "past-week":
                startDate = endDate.minusWeeks(1);
                break;
            case "past-month":
                startDate = endDate.minusMonths(1);
                break;
            case "past-year":
                startDate = endDate.minusYears(1);
                break;
            default:
                throw new NoSuchFieldException("Type duration <" + typeDuration + "> not known");
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SerializableUtils.singletonMap(
                        "tickets",
                        this.tickets.findAllWithPeriode(
                                Date.from(startDate.atZone(ZoneId.systemDefault()).toInstant()),
                                Date.from(endDate.atZone(ZoneId.systemDefault()).toInstant())
                        )
                ));
    }

}
