package com.example.NFEspring.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "assignee")
public class Assignee implements Serializable {

    @Id
    @Column(name = "ag_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "ag_user")
    @NotNull
    private User user;

    @ManyToOne
    @JoinColumn(name = "ag_ticket")
    @NotNull
    @JsonIgnoreProperties({ "assignees", "referents", "references", "data" })
    private Ticket ticket;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

}
