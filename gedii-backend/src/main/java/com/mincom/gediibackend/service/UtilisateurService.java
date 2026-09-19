package com.mincom.gediibackend.service;

import com.mincom.gediibackend.dto.UtilisateurResponseDTO;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.entity.enums.Role;
import com.mincom.gediibackend.entity.enums.StatutCompte;
import com.mincom.gediibackend.repository.UtilisateurRepository;
import org.springframework.stereotype.Component;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final EntityManager entityManager;
    private final NotificationService notificationService;

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              EntityManager entityManager,
                              NotificationService notificationService) {
        this.utilisateurRepository = utilisateurRepository;
        this.entityManager = entityManager;
        this.notificationService = notificationService;
    }

    public List<UtilisateurResponseDTO> getEnAttente() {
        return utilisateurRepository.findByStatutCompte(StatutCompte.EN_ATTENTE)
                .stream()
                .map(UtilisateurResponseDTO::new)
                .toList();
    }

    public List<UtilisateurResponseDTO> getActifs() {
        return utilisateurRepository.findByStatutCompte(StatutCompte.ACTIF)
                .stream()
                .map(UtilisateurResponseDTO::new)
                .toList();
    }

    @Transactional
    public UtilisateurResponseDTO valider(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (utilisateur.getStatutCompte() != StatutCompte.EN_ATTENTE) {
            throw new IllegalStateException("Ce compte n'est pas en attente de validation");
        }

        utilisateur.setStatutCompte(StatutCompte.ACTIF);
        utilisateurRepository.save(utilisateur);

        // Si c'est un TECHNICIEN, on crée automatiquement la ligne technicien_info
        if (utilisateur.getRole() == Role.TECHNICIEN) {
            entityManager.createNativeQuery(
                            "INSERT INTO technicien_info (id, specialite, disponibilite) VALUES (:id, :specialite, true)"
                    ).setParameter("id", utilisateur.getId())
                    .setParameter("specialite", "Généraliste")
                    .executeUpdate();
        }

        notificationService.envoyer(
                utilisateur.getEmail(),
                "Votre compte GEDII a été activé",
                "Bonjour " + utilisateur.getNom() + ", votre compte a été validé par le responsable. Vous pouvez maintenant vous connecter."
        );

        return new UtilisateurResponseDTO(utilisateur);
    }

    public UtilisateurResponseDTO rejeter(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (utilisateur.getStatutCompte() != StatutCompte.EN_ATTENTE) {
            throw new IllegalStateException("Ce compte n'est pas en attente de validation");
        }

        utilisateur.setStatutCompte(StatutCompte.REJETE);
        utilisateurRepository.save(utilisateur);

        return new UtilisateurResponseDTO(utilisateur);
    }

    @Transactional
    public UtilisateurResponseDTO promouvoirTechnicien(Long id, String specialite) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (utilisateur.getRole() == Role.TECHNICIEN) {
            throw new IllegalStateException("Cet utilisateur est déjà technicien");
        }

        entityManager.createNativeQuery(
                        "INSERT INTO technicien_info (id, specialite, disponibilite) VALUES (:id, :specialite, true)"
                ).setParameter("id", id)
                .setParameter("specialite", specialite)
                .executeUpdate();

        utilisateur.setRole(Role.TECHNICIEN);
        utilisateurRepository.save(utilisateur);

        return new UtilisateurResponseDTO(utilisateur);
    }

    public List<UtilisateurResponseDTO> getTechniciens() {
        return utilisateurRepository.findByRole(Role.TECHNICIEN)
                .stream()
                .map(UtilisateurResponseDTO::new)
                .toList();
    }
}