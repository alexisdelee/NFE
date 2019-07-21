package com.example.NFEspring.entity;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Entity
@Table(name = "link")
public class Link implements Serializable {

    @Id
    @Column(name = "lk_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "lk_referent_description")
    @NotEmpty
    private String referentDescription;

    @Column(name = "lk_reference_description")
    @NotEmpty
    private String referenceDescription;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReferentDescription() {
        return referentDescription;
    }

    public void setReferentDescription(String referentDescription) {
        this.referentDescription = referentDescription;
    }

    public String getReferenceDescription() {
        return referenceDescription;
    }

    public void setReferenceDescription(String referenceDescription) {
        this.referenceDescription = referenceDescription;
    }

}
