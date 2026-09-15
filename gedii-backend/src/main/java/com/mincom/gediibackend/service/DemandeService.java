package com.mincom.gediibackend.service;

import com.mincom.gediibackend.dto.demande.DemandeRequestDTO;
import com.mincom.gediibackend.dto.demande.DemandeResponseDTO;
import com.mincom.gediibackend.entity.Demande;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.entity.enums.StatutDemande;
import com.mincom.gediibackend.repository.DemandeRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DemandeService {

    private final DemandeRepository demandeRepository;
    private final NotificationService notificationService;

    public DemandeService(DemandeRepository demandeRepository, NotificationService notificationService) {
        this.demandeRepository = demandeRepository;
        this.notificationService = notificationService;
    }

    public DemandeResponseDTO creer(DemandeRequestDTO dto, Utilisateur agent) {
        Demande demande = new Demande();
        demande.setTitre(dto.getTitre());
        demande.setDescription(dto.getDescription());
        demande.setUrgence(dto.getUrgence());
        demande.setAgent(agent);
        demande.setStatut(StatutDemande.EN_ATTENTE);

        return new DemandeResponseDTO(demandeRepository.save(demande));
    }

    public List<DemandeResponseDTO> getMesDemandes(Utilisateur agent) {
        return demandeRepository.findByAgent(agent)
                .stream().map(DemandeResponseDTO::new).toList();
    }

    public List<DemandeResponseDTO> getEnAttente() {
        return demandeRepository.findByStatut(StatutDemande.EN_ATTENTE)
                .stream().map(DemandeResponseDTO::new).toList();
    }

    public List<DemandeResponseDTO> getValidees() {
        return demandeRepository.findByStatut(StatutDemande.VALIDEE)
                .stream().map(DemandeResponseDTO::new).toList();
    }

    public DemandeResponseDTO valider(Long id) {
        Demande demande = demandeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande introuvable"));

        if (demande.getStatut() != StatutDemande.EN_ATTENTE) {
            throw new IllegalStateException("Demande déjà traitée");
        }

        demande.setStatut(StatutDemande.VALIDEE);
        demande.setDateValidation(LocalDateTime.now());
        demandeRepository.save(demande);

        notificationService.envoyer(
                demande.getAgent().getEmail(),
                "Votre demande a été validée",
                "Votre demande '" + demande.getTitre() + "' a été validée et sera bientôt assignée à un technicien."
        );

        return new DemandeResponseDTO(demande);
    }

    public DemandeResponseDTO rejeter(Long id) {
        Demande demande = demandeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande introuvable"));

        if (demande.getStatut() != StatutDemande.EN_ATTENTE) {
            throw new IllegalStateException("Demande déjà traitée");
        }

        demande.setStatut(StatutDemande.REJETEE);
        demandeRepository.save(demande);

        return new DemandeResponseDTO(demande);
    }
}