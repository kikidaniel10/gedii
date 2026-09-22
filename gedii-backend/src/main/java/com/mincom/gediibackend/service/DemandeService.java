package com.mincom.gediibackend.service;

import com.mincom.gediibackend.dto.demande.DemandeRequestDTO;
import com.mincom.gediibackend.dto.demande.DemandeResponseDTO;
import com.mincom.gediibackend.entity.Demande;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.entity.enums.StatutDemande;
import com.mincom.gediibackend.repository.DemandeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DemandeService {

    private final DemandeRepository demandeRepository;
    private final NotificationService notificationService;
    private final EmailTemplateService emailTemplateService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public DemandeService(DemandeRepository demandeRepository,
                          NotificationService notificationService,
                          EmailTemplateService emailTemplateService) {
        this.demandeRepository = demandeRepository;
        this.notificationService = notificationService;
        this.emailTemplateService = emailTemplateService;
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

        String loginUrl = frontendUrl + "/login";
        String html = emailTemplateService.validationDemande(
                demande.getAgent().getNom(), demande.getTitre(), loginUrl);
        String texte = "Bonjour " + demande.getAgent().getNom() + ",\n\n"
                + "Votre demande '" + demande.getTitre() + "' a été validée et sera bientôt assignée à un technicien.\n\n"
                + "Consultez son état : " + loginUrl + "\n\n"
                + "Cordialement,\nGEDII - Cellule Informatique du MINCOM";

        notificationService.envoyer(
                demande.getAgent().getEmail(),
                "Votre demande a été validée",
                html,
                texte
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