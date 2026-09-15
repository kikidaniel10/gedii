package com.mincom.gediibackend.dto.statistique;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatistiqueResponseDTO {
    private long totalDemandes;
    private long enAttente;
    private long enCours;
    private long resolues;
    private long rejetees;
    private double tauxResolution;
}