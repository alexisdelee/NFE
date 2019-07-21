package com.example.NFEspring.entity;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Set;

@javax.persistence.Entity
@Table(name = "entity")
public class Entity implements Serializable {

    @Id
    @Column(name = "en_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "en_label")
    @NotEmpty
    private String label;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "entity")
    @NotNull
    private Set<Permission> permissions;

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

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }

}
