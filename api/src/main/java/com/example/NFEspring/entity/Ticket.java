package com.example.NFEspring.entity;

import com.example.NFEspring.listener.TicketListener;
import org.hibernate.annotations.ColumnTransformer;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Entity
@EntityListeners(TicketListener.class)
@Table(name = "ticket")
public class Ticket implements Serializable {

    @Id
    @Column(name = "tk_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "tk_region")
    @NotNull
    private Region region;

    @Column(name = "tk_summary")
    @NotEmpty
    private String summary;

    @Column(name = "tk_description", columnDefinition = "BLOB")
    @ColumnTransformer(read = "uncompress(tk_description)", write = "compress(?)")
    @Lob
    private byte[] description;

    @OneToOne
    @JoinColumn(name = "tk_tracker")
    @NotNull
    private Tracker tracker;

    @OneToOne
    @JoinColumn(name = "tk_priority")
    @NotNull
    private Priority priority;

    @OneToOne
    @JoinColumn(name = "tk_status")
    @NotNull
    private Status status;

    @OneToOne
    @JoinColumn(name = "tk_reporter")
    @NotNull
    private User reporter;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ticket")
    private Set<Assignee> assignees;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "referent")
    @NotNull
    private Set<LinkTicket> referents;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "reference")
    @NotNull
    private Set<LinkTicket> references;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ticket")
    // @NotNull
    private Set<ItemData> data;

    @Column(name = "tk_deleted")
    @NotNull
    private boolean deleted;

    @Column(name = "tk_archived")
    @NotNull
    private boolean archived;

    @Column(name = "tk_created")
    @NotNull
    private Date created;

    @Column(name = "tk_updated")
    private Date updated;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public byte[] getDescription() {
        return description;
    }

    public void setDescription(byte[] description) {
        this.description = description;
    }

    public Tracker getTracker() {
        return tracker;
    }

    public void setTracker(Tracker tracker) {
        this.tracker = tracker;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public Set<Assignee> getAssignees() {
        return assignees;
    }

    public void setAssignees(Set<Assignee> assignees) {
        this.assignees = assignees;
    }

    public Set<LinkTicket> getReferents() {
        return referents;
    }

    public void setReferents(Set<LinkTicket> referents) {
        this.referents = referents;
    }

    public Set<LinkTicket> getReferences() {
        return references;
    }

    public void setReferences(Set<LinkTicket> references) {
        this.references = references;
    }

    public Set<ItemData> getData() {
        return data;
    }

    public void setData(Set<ItemData> data) {
        this.data = data;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

}
