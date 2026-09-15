package com.mincom.gediibackend.controller;

import com.mincom.gediibackend.dto.statistique.PerformanceTechnicienDTO;
import com.mincom.gediibackend.dto.statistique.StatistiqueResponseDTO;
import com.mincom.gediibackend.service.StatistiqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statistiques")
public class StatistiqueController {

    private final StatistiqueService statistiqueService;

    public StatistiqueController(StatistiqueService statistiqueService) {
        this.statistiqueService = statistiqueService;
    }

    @GetMapping
    public ResponseEntity<StatistiqueResponseDTO> getStatistiques() {
        return ResponseEntity.ok(statistiqueService.getStatistiques());
    }

    @GetMapping("/techniciens")
    public ResponseEntity<List<PerformanceTechnicienDTO>> getPerformanceTechniciens() {
        return ResponseEntity.ok(statistiqueService.getPerformanceTechniciens());
    }
}