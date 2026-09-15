package com.mincom.gediibackend.dto;

import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.entity.enums.Role;
import com.mincom.gediibackend.entity.enums.StatutCompte;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UtilisateurResponseDTO {
    private final Long id;
    private final String nom;
    private final String matricule;
    private final String email;
    private final Role role;
    private final StatutCompte statutCompte;
    private final String serviceNom;
    private final LocalDateTime dateCreation;

    public UtilisateurResponseDTO(Utilisateur u) {
        this.id = u.getId();
        this.nom = u.getNom();
        this.matricule = u.getMatricule();
        this.email = u.getEmail();
        this.role = u.getRole();
        this.statutCompte = u.getStatutCompte();
        this.serviceNom = u.getService().getNom();
        this.dateCreation = u.getDateCreation();
    }
}