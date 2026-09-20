package com.mincom.gediibackend.dto.statistique;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class StatistiqueResponseDTO {
    private long totalDemandes;
    private long enAttente;
    private long enCours;
    private long resolues;
    private long rejetees;
    private double tauxResolution;
    private double delaiMoyenHeures;
    private List<Map<String, Object>> demandesParService;
    private List<Map<String, Object>> evolutionMensuelle;
}