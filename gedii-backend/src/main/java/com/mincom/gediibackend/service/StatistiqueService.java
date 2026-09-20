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

    public StatistiqueResponseDTO getStatistiques() {
        long enAttente = demandeRepository.countByStatut(StatutDemande.EN_ATTENTE);
        long enCours = demandeRepository.countByStatut(StatutDemande.EN_COURS);
        long resolues = demandeRepository.countByStatut(StatutDemande.RESOLUE);
        long rejetees = demandeRepository.countByStatut(StatutDemande.REJETEE);
        long validees = demandeRepository.countByStatut(StatutDemande.VALIDEE);

        long total = enAttente + enCours + resolues + rejetees + validees;
        double taux = total > 0 ? (resolues * 100.0) / total : 0;

        double delaiMoyen = calculerDelaiMoyenHeures();
        List<Map<String, Object>> parService = calculerDemandesParService();
        List<Map<String, Object>> evolution = calculerEvolutionMensuelle();

        return new StatistiqueResponseDTO(
                total, enAttente, enCours, resolues, rejetees,
                taux, delaiMoyen, parService, evolution
        );
    }

    private double calculerDelaiMoyenHeures() {
        List<Intervention> terminees = interventionRepository.findByStatut(StatutIntervention.TERMINEE);

        return terminees.stream()
                .filter(i -> i.getDateDebut() != null && i.getDateFin() != null)
                .mapToDouble(i -> Duration.between(i.getDateDebut(), i.getDateFin()).toMinutes() / 60.0)
                .average()
                .orElse(0.0);
    }

    private List<Map<String, Object>> calculerDemandesParService() {
        List<Demande> toutes = demandeRepository.findAll();

        Map<String, Long> parService = toutes.stream()
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

    private List<Map<String, Object>> calculerEvolutionMensuelle() {
        List<Demande> toutes = demandeRepository.findAll();
        LocalDateTime maintenant = LocalDateTime.now();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM", Locale.FRENCH);

        List<Map<String, Object>> resultat = new ArrayList<>();

        // 5 derniers mois (incluant le mois courant)
        for (int i = 4; i >= 0; i--) {
            LocalDateTime mois = maintenant.minusMonths(i);
            int annee = mois.getYear();
            int moisValeur = mois.getMonthValue();

            long count = toutes.stream()
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
}