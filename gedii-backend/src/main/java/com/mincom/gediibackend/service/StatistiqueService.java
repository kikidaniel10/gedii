package com.mincom.gediibackend.service;

import com.mincom.gediibackend.dto.statistique.PerformanceTechnicienDTO;
import com.mincom.gediibackend.dto.statistique.StatistiqueResponseDTO;
import com.mincom.gediibackend.entity.Intervention;
import com.mincom.gediibackend.entity.enums.StatutDemande;
import com.mincom.gediibackend.entity.enums.StatutIntervention;
import com.mincom.gediibackend.repository.DemandeRepository;
import com.mincom.gediibackend.repository.InterventionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
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

        return new StatistiqueResponseDTO(total, enAttente, enCours, resolues, rejetees, taux);
    }

    public List<PerformanceTechnicienDTO> getPerformanceTechniciens() {
        List<Intervention> terminees = interventionRepository.findByStatut(StatutIntervention.TERMINEE);

        Map<String, Long> parTechnicien = terminees.stream()
                .collect(Collectors.groupingBy(
                        i -> i.getTechnicien().getNom(),
                        Collectors.counting()
                ));

        return parTechnicien.entrySet().stream()
                .map(e -> new PerformanceTechnicienDTO(e.getKey(), e.getValue()))
                .toList();
    }
}