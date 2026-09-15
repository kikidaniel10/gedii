package com.mincom.gediibackend.dto.demande;

import com.mincom.gediibackend.entity.Demande;
import com.mincom.gediibackend.entity.enums.StatutDemande;
import com.mincom.gediibackend.entity.enums.Urgence;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DemandeResponseDTO {
    private final Long id;
    private final String titre;
    private final String description;
    private final StatutDemande statut;
    private final Urgence urgence;
    private final String agentNom;
    private final Long agentId;
    private final LocalDateTime dateCreation;
    private final LocalDateTime dateValidation;

    public DemandeResponseDTO(Demande d) {
        this.id = d.getId();
        this.titre = d.getTitre();
        this.description = d.getDescription();
        this.statut = d.getStatut();
        this.urgence = d.getUrgence();
        this.agentNom = d.getAgent().getNom();
        this.agentId = d.getAgent().getId();
        this.dateCreation = d.getDateCreation();
        this.dateValidation = d.getDateValidation();
    }
}