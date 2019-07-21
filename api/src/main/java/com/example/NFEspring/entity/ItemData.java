package com.example.NFEspring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "item_data")
public class ItemData implements Serializable {

    @Id
    @Column(name = "it_dt_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "it_dt_value")
    private String value;

    @Column(name = "it_dt_iteration")
    @NotNull
    private Integer iteration;

    @OneToOne
    @JoinColumn(name = "it_dt_item")
    @NotNull
    private Item item;

    @ManyToOne
    @JoinColumn(name = "it_dt_ticket")
    @NotNull
    // @JsonIgnoreProperties({ "reporter", "assignees", "referents", "references", "data" })
    @JsonIgnore
    private Ticket ticket;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Integer getIteration() {
        return iteration;
    }

    public void setIteration(Integer iteration) {
        this.iteration = iteration;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

}
