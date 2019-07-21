package com.example.NFEspring.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@javax.persistence.Entity
@Table(name = "permission")
public class Permission implements Serializable {

    @Id
    @Column(name = "pm_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pm_create")
    @NotNull
    private boolean create;

    @Column(name = "pm_read")
    @NotNull
    private boolean read;

    @Column(name = "pm_update")
    @NotNull
    private boolean update;

    @Column(name = "pm_delete")
    @NotNull
    private boolean delete;

    @ManyToOne
    @JoinColumn(name = "pm_role")
    @NotNull
    @JsonIgnoreProperties("permissions")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "pm_entity")
    @NotNull
    @JsonIgnoreProperties("permissions")
    private Entity entity;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public boolean isCreate() {
        return create;
    }

    public void setCreate(boolean create) {
        this.create = create;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public boolean isUpdate() {
        return update;
    }

    public void setUpdate(boolean update) {
        this.update = update;
    }

    public boolean isDelete() {
        return delete;
    }

    public void setDelete(boolean delete) {
        this.delete = delete;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Entity getEntity() {
        return entity;
    }

    public void setEntity(Entity entity) {
        this.entity = entity;
    }

}
