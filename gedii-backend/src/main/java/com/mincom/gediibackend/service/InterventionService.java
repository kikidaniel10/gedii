package com.mincom.gediibackend.service;

import com.mincom.gediibackend.dto.intervention.AssignationRequestDTO;
import com.mincom.gediibackend.dto.intervention.CompteRenduRequestDTO;
import com.mincom.gediibackend.dto.intervention.InterventionResponseDTO;
import com.mincom.gediibackend.entity.Demande;
import com.mincom.gediibackend.entity.Intervention;
import com.mincom.gediibackend.entity.TechnicienInfo;
import com.mincom.gediibackend.entity.enums.StatutDemande;
import com.mincom.gediibackend.entity.enums.StatutIntervention;
import com.mincom.gediibackend.repository.DemandeRepository;
import com.mincom.gediibackend.repository.InterventionRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final DemandeRepository demandeRepository;
    private final EntityManager entityManager;

    public InterventionService(InterventionRepository interventionRepository,
                               DemandeRepository demandeRepository,
                               EntityManager entityManager) {
        this.interventionRepository = interventionRepository;
        this.demandeRepository = demandeRepository;
        this.entityManager = entityManager;
    }

    public InterventionResponseDTO assigner(AssignationRequestDTO dto) {
        Demande demande = demandeRepository.findById(dto.getDemandeId())
                .orElseThrow(() -> new IllegalArgumentException("Demande introuvable"));

        if (demande.getStatut() != StatutDemande.VALIDEE) {
            throw new IllegalStateException("La demande doit être validée avant assignation");
        }

        TechnicienInfo technicien = entityManager.find(TechnicienInfo.class, dto.getTechnicienId());
        if (technicien == null) {
            throw new IllegalArgumentException("Technicien introuvable");
        }

        Intervention intervention = new Intervention();
        intervention.setDemande(demande);
        intervention.setTechnicien(technicien);
        intervention.setStatut(StatutIntervention.ASSIGNEE);

        demande.setStatut(StatutDemande.EN_COURS);
        demandeRepository.save(demande);

        return new InterventionResponseDTO(interventionRepository.save(intervention));
    }

    public List<InterventionResponseDTO> getMesInterventions(TechnicienInfo technicien) {
        return interventionRepository.findByTechnicien(technicien)
                .stream().map(InterventionResponseDTO::new).toList();
    }

    public InterventionResponseDTO demarrer(Long id) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Intervention introuvable"));

        intervention.setStatut(StatutIntervention.EN_COURS);
        return new InterventionResponseDTO(interventionRepository.save(intervention));
    }

    public InterventionResponseDTO cloturer(Long id, CompteRenduRequestDTO dto) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Intervention introuvable"));

        intervention.setStatut(StatutIntervention.TERMINEE);
        intervention.setCompteRendu(dto.getCompteRendu());
        intervention.setDateFin(LocalDateTime.now());
        interventionRepository.save(intervention);

        Demande demande = intervention.getDemande();
        demande.setStatut(StatutDemande.RESOLUE);
        demandeRepository.save(demande);

        // TODO: notifier l'agent une fois NotificationService cree

        return new InterventionResponseDTO(intervention);
    }
}