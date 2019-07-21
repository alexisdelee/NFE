package com.example.NFEspring.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "item")
public class Item implements Serializable {

    @Id
    @Column(name = "it_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "it_label")
    @NotEmpty
    private String label;

    @Column(name = "it_readonly")
    @NotNull
    private boolean readonly;

    @Column(name = "it_required")
    @NotNull
    private boolean required;

    @Column(name = "it_sort")
    @NotNull
    private Integer sort;

    @OneToOne
    @JoinColumn(name = "it_tracker")
    @NotNull
    private Tracker tracker;

    @OneToOne
    @JoinColumn(name = "it_universal")
    @NotNull
    private Universal universal;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "item")
    @NotNull
    @JsonIgnoreProperties("item")
    private Set<ItemOption> options;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public boolean isReadonly() {
        return readonly;
    }

    public void setReadonly(boolean readonly) {
        this.readonly = readonly;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Tracker getTracker() {
        return tracker;
    }

    public void setTracker(Tracker tracker) {
        this.tracker = tracker;
    }

    public Universal getUniversal() {
        return universal;
    }

    public void setUniversal(Universal universal) {
        this.universal = universal;
    }

    public Set<ItemOption> getOptions() {
        return options;
    }

    public void setOptions(Set<ItemOption> options) {
        this.options = options;
    }

}
