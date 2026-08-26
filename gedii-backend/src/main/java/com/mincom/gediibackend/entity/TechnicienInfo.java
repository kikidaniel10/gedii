package com.mincom.gediibackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "technicien_info")
@Getter
@Setter
@NoArgsConstructor
public class TechnicienInfo extends Utilisateur {

    private String specialite;

    private Boolean disponibilite = true;
}