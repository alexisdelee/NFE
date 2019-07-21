package com.example.NFEspring.entity;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "resource")
public class Resource implements Serializable {

    @Id
    @Column(name = "re_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "re_folder")
    @NotEmpty
    private String folder;

    @Column(name = "re_filename")
    @NotEmpty
    private String filename;

    @Column(name = "re_created")
    @NotEmpty
    private Date created;

    @Column(name = "re_updated")
    private Date updated;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
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
