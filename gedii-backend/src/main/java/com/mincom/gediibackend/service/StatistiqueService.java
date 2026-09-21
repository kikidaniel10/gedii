package com.mincom.gediibackend.service;

import com.mincom.gediibackend.dto.statistique.PerformanceTechnicienDTO;
import com.mincom.gediibackend.dto.statistique.StatistiqueResponseDTO;
import com.mincom.gediibackend.entity.Demande;
import com.mincom.gediibackend.entity.Intervention;
import com.mincom.gediibackend.entity.enums.StatutDemande;
import com.mincom.gediibackend.entity.enums.StatutIntervention;
import com.mincom.gediibackend.repository.DemandeRepository;
import com.mincom.gediibackend.repository.InterventionRepository;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class StatistiqueService {

    private final DemandeRepository demandeRepository;
    private final InterventionRepository interventionRepository;

    public StatistiqueService(DemandeRepository demandeRepository, InterventionRepository interventionRepository) {
        this.demandeRepository = demandeRepository;
        this.interventionRepository = interventionRepository;
    }

    /**
     * Version de compatibilité (appelée sans paramètre).
     * Comportement identique à avant : toutes les demandes, 5 derniers mois.
     */
    public StatistiqueResponseDTO getStatistiques() {
        return getStatistiques(null, null);
    }

    /**
     * Version enrichie avec période et filtre service.
     *
     * @param periode  "7j", "30j", "3m", "6m", "1a" ou null (= tout)
     * @param service  nom du service à filtrer (null = tous)
     */
    public StatistiqueResponseDTO getStatistiques(String periode, String service) {
        LocalDateTime dateDebut = calculerDateDebut(periode);
        LocalDateTime dateDebutPrecedente = calculerDateDebutPrecedente(periode, dateDebut);

        List<Demande> toutesDemandes = demandeRepository.findAll();

        // Filtre service
        List<Demande> demandesFiltrees = toutesDemandes.stream()
                .filter(d -> {
                    if (service == null || service.isBlank()) return true;
                    return d.getAgent() != null
                            && d.getAgent().getService() != null
                            && service.equalsIgnoreCase(d.getAgent().getService().getNom());
                })
                .toList();

        // Filtre période
        List<Demande> demandesPeriode = demandesFiltrees.stream()
                .filter(d -> d.getDateCreation() != null)
                .filter(d -> dateDebut == null || !d.getDateCreation().isBefore(dateDebut))
                .toList();

        // Période précédente (pour les deltas)
        List<Demande> demandesPeriodePrecedente = demandesFiltrees.stream()
                .filter(d -> d.getDateCreation() != null)
                .filter(d -> dateDebut != null && dateDebutPrecedente != null)
                .filter(d -> !d.getDateCreation().isBefore(dateDebutPrecedente)
                        && d.getDateCreation().isBefore(dateDebut))
                .toList();

        long enAttente = countByStatut(demandesPeriode, StatutDemande.EN_ATTENTE);
        long enCours = countByStatut(demandesPeriode, StatutDemande.EN_COURS);
        long resolues = countByStatut(demandesPeriode, StatutDemande.RESOLUE);
        long rejetees = countByStatut(demandesPeriode, StatutDemande.REJETEE);
        long validees = countByStatut(demandesPeriode, StatutDemande.VALIDEE);

        long total = enAttente + enCours + resolues + rejetees + validees;
        double taux = total > 0 ? (resolues * 100.0) / total : 0;

        double delaiMoyen = calculerDelaiMoyenHeures(periode);
        List<Map<String, Object>> parService = calculerDemandesParService(demandesFiltrees, dateDebut);
        List<Map<String, Object>> evolution = calculerEvolution(demandesFiltrees, periode);

        long totalPrecedente = demandesPeriodePrecedente.size();
        long resoluesPrecedente = countByStatut(demandesPeriodePrecedente, StatutDemande.RESOLUE);

        return new StatistiqueResponseDTO(
                total, enAttente, enCours, resolues, rejetees,
                taux, delaiMoyen, parService, evolution,
                totalPrecedente, resoluesPrecedente, labelPeriode(periode)
        );
    }

    private long countByStatut(List<Demande> demandes, StatutDemande statut) {
        return demandes.stream().filter(d -> d.getStatut() == statut).count();
    }

    private LocalDateTime calculerDateDebut(String periode) {
        if (periode == null || periode.isBlank()) return null;
        LocalDateTime maintenant = LocalDateTime.now();
        return switch (periode) {
            case "7j" -> maintenant.minusDays(7);
            case "30j" -> maintenant.minusDays(30);
            case "3m" -> maintenant.minusMonths(3);
            case "6m" -> maintenant.minusMonths(6);
            case "1a" -> maintenant.minusYears(1);
            default -> null;
        };
    }

    private LocalDateTime calculerDateDebutPrecedente(String periode, LocalDateTime dateDebut) {
        if (periode == null || periode.isBlank() || dateDebut == null) return null;
        LocalDateTime maintenant = LocalDateTime.now();
        return switch (periode) {
            case "7j" -> maintenant.minusDays(14);
            case "30j" -> maintenant.minusDays(60);
            case "3m" -> maintenant.minusMonths(6);
            case "6m" -> maintenant.minusMonths(12);
            case "1a" -> maintenant.minusYears(2);
            default -> null;
        };
    }

    private String labelPeriode(String periode) {
        if (periode == null || periode.isBlank()) return "Toutes les données";
        return switch (periode) {
            case "7j" -> "7 derniers jours";
            case "30j" -> "30 derniers jours";
            case "3m" -> "3 derniers mois";
            case "6m" -> "6 derniers mois";
            case "1a" -> "12 derniers mois";
            default -> "Toutes les données";
        };
    }

    private double calculerDelaiMoyenHeures(String periode) {
        LocalDateTime dateDebut = calculerDateDebut(periode);
        List<Intervention> terminees = interventionRepository.findByStatut(StatutIntervention.TERMINEE);

        return terminees.stream()
                .filter(i -> i.getDateDebut() != null && i.getDateFin() != null)
                .filter(i -> dateDebut == null || !i.getDateDebut().isBefore(dateDebut))
                .mapToDouble(i -> Duration.between(i.getDateDebut(), i.getDateFin()).toMinutes() / 60.0)
                .average()
                .orElse(0.0);
    }

    private List<Map<String, Object>> calculerDemandesParService(List<Demande> demandes, LocalDateTime dateDebut) {
        Map<String, Long> parService = demandes.stream()
                .filter(d -> dateDebut == null || (d.getDateCreation() != null && !d.getDateCreation().isBefore(dateDebut)))
                .filter(d -> d.getAgent() != null && d.getAgent().getService() != null)
                .collect(Collectors.groupingBy(
                        d -> d.getAgent().getService().getNom(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        List<Map<String, Object>> resultat = new ArrayList<>();
        parService.forEach((service, count) -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("service", service);
            entry.put("total", count);
            resultat.add(entry);
        });
        return resultat;
    }

    private List<Map<String, Object>> calculerEvolution(List<Demande> demandes, String periode) {
        LocalDateTime maintenant = LocalDateTime.now();
        List<Map<String, Object>> resultat = new ArrayList<>();

        // Nombre de mois à afficher selon la période
        int nbMois = switch (periode == null ? "" : periode) {
            case "7j", "30j" -> 4;      // 5 mois glissants
            case "3m" -> 3;
            case "6m" -> 6;
            case "1a" -> 12;
            default -> 5;
        };

        DateTimeFormatter fmt = nbMois > 6
                ? DateTimeFormatter.ofPattern("MMM yy", Locale.FRENCH)
                : DateTimeFormatter.ofPattern("MMM", Locale.FRENCH);

        for (int i = nbMois - 1; i >= 0; i--) {
            LocalDateTime mois = maintenant.minusMonths(i);
            int annee = mois.getYear();
            int moisValeur = mois.getMonthValue();

            long count = demandes.stream()
                    .filter(d -> d.getDateCreation() != null)
                    .filter(d -> d.getDateCreation().getYear() == annee
                            && d.getDateCreation().getMonthValue() == moisValeur)
                    .count();

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("mois", mois.format(fmt));
            entry.put("demandes", count);
            resultat.add(entry);
        }
        return resultat;
    }

    public List<PerformanceTechnicienDTO> getPerformanceTechniciens() {
        List<Intervention> terminees = interventionRepository.findByStatut(StatutIntervention.TERMINEE);

        Map<String, List<Intervention>> parTechnicien = terminees.stream()
                .collect(Collectors.groupingBy(i -> i.getTechnicien().getNom()));

        return parTechnicien.entrySet().stream()
                .map(e -> {
                    String nom = e.getKey();
                    List<Intervention> interventions = e.getValue();

                    double delaiMoyen = interventions.stream()
                            .filter(i -> i.getDateDebut() != null && i.getDateFin() != null)
                            .mapToDouble(i -> Duration.between(i.getDateDebut(), i.getDateFin()).toMinutes() / 60.0)
                            .average()
                            .orElse(0.0);

                    return new PerformanceTechnicienDTO(nom, interventions.size(), delaiMoyen);
                })
                .sorted((a, b) -> Long.compare(b.getInterventionsResolues(), a.getInterventionsResolues()))
                .toList();
    }

    public List<String> getListeServices() {
        return demandeRepository.findAll().stream()
                .filter(d -> d.getAgent() != null && d.getAgent().getService() != null)
                .map(d -> d.getAgent().getService().getNom())
                .distinct()
                .sorted()
                .toList();
    }
}