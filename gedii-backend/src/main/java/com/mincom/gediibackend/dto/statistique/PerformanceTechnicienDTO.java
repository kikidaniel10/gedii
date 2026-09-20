package com.mincom.gediibackend.dto.statistique;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PerformanceTechnicienDTO {
    private String nom;
    private long interventionsResolues;
    private double delaiMoyenHeures;
}