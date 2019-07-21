package com.example.NFEspring.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "history")
public class History implements Serializable {

    @Id
    @Column(name = "ht_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ht_category")
    private String category;

    @Column(name = "ht_label")
    @NotNull
    private String label;

    @Column(name = "ht_previous_value")
    private String previousValue;

    @Column(name = "ht_next_value")
    private String nextValue;

    @OneToOne
    @JoinColumn(name = "ht_user")
    private User user;

    @OneToOne
    @JoinColumn(name = "ht_ticket")
    @JsonIgnoreProperties({ "assignees", "referents", "references", "data" })
    private Ticket ticket;

    @Column(name = "ht_created")
    @NotNull
    private Date created;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPreviousValue() {
        return previousValue;
    }

    public void setPreviousValue(String previousValue) {
        this.previousValue = previousValue;
    }

    public String getNextValue() {
        return nextValue;
    }

    public void setNextValue(String nextValue) {
        this.nextValue = nextValue;
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

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

}
