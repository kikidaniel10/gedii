package com.mincom.gediibackend.controller;

import com.mincom.gediibackend.dto.statistique.PerformanceTechnicienDTO;
import com.mincom.gediibackend.dto.statistique.StatistiqueResponseDTO;
import com.mincom.gediibackend.service.RapportStatistiqueService;
import com.mincom.gediibackend.service.StatistiqueService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistiques")
public class StatistiqueController {

    private final StatistiqueService statistiqueService;
    private final RapportStatistiqueService rapportStatistiqueService;

    public StatistiqueController(StatistiqueService statistiqueService,
                                 RapportStatistiqueService rapportStatistiqueService) {
        this.statistiqueService = statistiqueService;
        this.rapportStatistiqueService = rapportStatistiqueService;
    }

    @GetMapping
    public ResponseEntity<StatistiqueResponseDTO> getStatistiques(
            @RequestParam(value = "periode", required = false) String periode,
            @RequestParam(value = "service", required = false) String service) {
        return ResponseEntity.ok(statistiqueService.getStatistiques(periode, service));
    }

    @GetMapping("/services")
    public ResponseEntity<List<String>> getListeServices() {
        return ResponseEntity.ok(statistiqueService.getListeServices());
    }

    @GetMapping("/techniciens")
    public ResponseEntity<List<PerformanceTechnicienDTO>> getPerformanceTechniciens() {
        return ResponseEntity.ok(statistiqueService.getPerformanceTechniciens());
    }

    @GetMapping("/rapport")
    public ResponseEntity<byte[]> genererRapport() throws Exception {
        byte[] pdf = rapportStatistiqueService.genererRapportStatistiques();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "rapport-statistiques.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}