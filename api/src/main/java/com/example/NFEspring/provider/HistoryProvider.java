package com.example.NFEspring.provider;

import com.example.NFEspring.entity.History;
import com.example.NFEspring.entity.Ticket;
import com.example.NFEspring.entity.User;
import com.example.NFEspring.utils.JwtUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

public class HistoryProvider {

    private User user;
    private Ticket ticket;
    private Collection<History> histories;

    public Collection<History> getHistories() {
        return this.histories;
    }

    public void setTicketId(Integer ticketId) {
        if (this.ticket == null) {
            this.ticket = new Ticket();
        }

        this.ticket.setId(ticketId);
        this.histories = this.histories // retroactive
                .stream()
                .peek(history -> history.getTicket().setId(ticketId))
                .collect(Collectors.toList());
    }

    public HistoryProvider(Integer userId, Integer ticketId) {
        this.histories = new ArrayList<>();

        this.user = new User();
        if (userId != null) {
            this.user.setId(userId);
        }

        this.ticket = new Ticket();
        if (ticketId != null) {
            this.ticket.setId(ticketId);
        }
    }

    public void addEntry(String category, String label, String nextValue, String previousValue) {
        try {
            if (nextValue == null && previousValue == null) {
                return;
            }

            if ((nextValue == null ^ previousValue == null) || !nextValue.equals(previousValue)) {
                throw new RuntimeException();
            }
        } catch (RuntimeException exception) {
            History history = new History();
            history.setId(null);
            history.setCategory(category);
            history.setLabel(label);
            history.setPreviousValue(previousValue);
            history.setNextValue(nextValue);
            history.setUser(user);
            history.setTicket(ticket);
            history.setCreated(new Date());

            this.histories.add(history);
        }
    }

    public void addEntry(String category, String label, String nextValue) {
        this.addEntry(category, label, nextValue, null);
    }

    public <T> Optional<T> addEntryAndReturnOptional(T entity, String category, String label, String nextValue, String previousValue) {
        this.addEntry(category, label, nextValue, previousValue);
        return Optional.ofNullable(entity);
    }

    public <T> Optional<T> addEntryAndReturnOptional(T entity, String category, String label, String nextValue) {
        return this.addEntryAndReturnOptional(entity, category, label, nextValue, null);
    }

    public <T> T addEntryAndReturn(T entity, String category, String label, String nextValue, String previousValue) {
        this.addEntry(category, label, nextValue, previousValue);
        return entity;
    }

    public <T> T addEntryAndReturn(T entity, String category, String label, String nextValue) {
        return this.addEntryAndReturn(entity, category, label, nextValue, null);
    }

}
