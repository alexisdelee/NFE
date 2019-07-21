package com.example.NFEspring.entity;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Entity
@Table(name = "priority")
public class Priority implements Serializable {

    @Id
    @Column(name = "pr_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pr_name")
    @NotEmpty
    private String name;

    @Column(name = "pr_shortname")
    @NotEmpty
    private String shortname;

    @Column(name = "pr_description")
    private String description;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortname() {
        return shortname;
    }

    public void setShortname(String shortname) {
        this.shortname = shortname;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
