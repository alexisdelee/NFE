package com.example.NFEspring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "user")
public class User implements Serializable {

    @Id
    @Column(name = "usr_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "usr_pseudo")
    @NotEmpty
    private String pseudo;

    @Column(name = "usr_nfeid", length = 18)
    @NotEmpty
    private String nfeid;

    @JsonIgnore
    @Column(name = "usr_password", length = 128)
    private String password;

    @JsonIgnore
    @Column(name = "usr_salt", length = 32)
    private String salt;

    @JsonIgnore
    @Column(name = "usr_iterations")
    @NotNull
    private Integer iterations;

    @OneToOne
    @JoinColumn(name = "usr_avatar")
    private Resource resource;

    @OneToOne
    @JoinColumn(name = "usr_role")
    @NotNull
    private Role role;

    @Column(name = "usr_deleted")
    @NotNull
    private boolean deleted;

    @Column(name = "usr_created")
    @NotNull
    private Date created;

    @Column(name = "usr_updated")
    private Date updated;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public String getNfeid() {
        return nfeid;
    }

    public void setNfeid(String nfeid) {
        this.nfeid = nfeid;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Integer getIterations() {
        return iterations;
    }

    public void setIterations(Integer iterations) {
        this.iterations = iterations;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        deleted = deleted;
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
