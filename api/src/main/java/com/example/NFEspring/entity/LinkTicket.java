package com.example.NFEspring.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "link_ticket")
public class LinkTicket implements Serializable {

    @Id
    @Column(name = "lk_tk_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "lk_tk_link")
    @NotNull
    private Link link;

    @ManyToOne
    @JoinColumn(name = "lk_tk_referent_ticket")
    @NotNull
    @JsonIgnoreProperties({ "reporter", "assignees", "referents", "references", "data" })
    private Ticket referent;

    @ManyToOne
    @JoinColumn(name = "lk_tk_reference_ticket")
    @NotNull
    @JsonIgnoreProperties({ "reporter", "assignees", "referents", "references", "data" })
    private Ticket reference;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Link getLink() {
        return link;
    }

    public void setLink(Link link) {
        this.link = link;
    }

    public Ticket getReferent() {
        return referent;
    }

    public void setReferent(Ticket referent) {
        this.referent = referent;
    }

    public Ticket getReference() {
        return reference;
    }

    public void setReference(Ticket reference) {
        this.reference = reference;
    }

}
