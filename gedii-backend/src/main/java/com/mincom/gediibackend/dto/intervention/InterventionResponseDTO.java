package com.mincom.gediibackend.dto.intervention;

import com.mincom.gediibackend.entity.Intervention;
import com.mincom.gediibackend.entity.enums.StatutIntervention;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class InterventionResponseDTO {
    private final Long id;
    private final StatutIntervention statut;
    private final String compteRendu;
    private final String demandeTitre;
    private final Long demandeId;
    private final String technicienNom;
    private final LocalDateTime dateDebut;
    private final LocalDateTime dateFin;

    public InterventionResponseDTO(Intervention i) {
        this.id = i.getId();
        this.statut = i.getStatut();
        this.compteRendu = i.getCompteRendu();
        this.demandeTitre = i.getDemande().getTitre();
        this.demandeId = i.getDemande().getId();
        this.technicienNom = i.getTechnicien().getNom();
        this.dateDebut = i.getDateDebut();
        this.dateFin = i.getDateFin();
    }
}