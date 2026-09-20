package com.mincom.gediibackend.controller;

import com.mincom.gediibackend.dto.intervention.AssignationRequestDTO;
import com.mincom.gediibackend.dto.intervention.CompteRenduRequestDTO;
import com.mincom.gediibackend.dto.intervention.InterventionResponseDTO;
import com.mincom.gediibackend.entity.TechnicienInfo;
import com.mincom.gediibackend.service.InterventionService;
import com.mincom.gediibackend.service.RapportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions")
public class InterventionController {

    private final InterventionService interventionService;
    private final RapportService rapportService;

    public InterventionController(InterventionService interventionService,
                                  RapportService rapportService) {
        this.interventionService = interventionService;
        this.rapportService = rapportService;
    }

    @PostMapping("/assigner")
    public ResponseEntity<InterventionResponseDTO> assigner(@RequestBody AssignationRequestDTO dto) {
        return ResponseEntity.ok(interventionService.assigner(dto));
    }

    @GetMapping("/mes-interventions")
    public ResponseEntity<List<InterventionResponseDTO>> getMesInterventions(@AuthenticationPrincipal TechnicienInfo technicien) {
        return ResponseEntity.ok(interventionService.getMesInterventions(technicien));
    }

    @GetMapping("/technicien/{id}")
    public ResponseEntity<List<InterventionResponseDTO>> getInterventionsByTechnicien(@PathVariable Long id) {
        return ResponseEntity.ok(interventionService.getInterventionsByTechnicien(id));
    }

    @GetMapping("/technicien/{id}/rapport")
    public ResponseEntity<byte[]> genererRapport(@PathVariable Long id) throws Exception {
        byte[] pdf = rapportService.genererRapportTechnicien(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "rapport-technicien-" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }

    @PutMapping("/{id}/demarrer")
    public ResponseEntity<InterventionResponseDTO> demarrer(@PathVariable Long id) {
        return ResponseEntity.ok(interventionService.demarrer(id));
    }

    @PutMapping("/{id}/cloturer")
    public ResponseEntity<InterventionResponseDTO> cloturer(@PathVariable Long id, @RequestBody CompteRenduRequestDTO dto) {
        return ResponseEntity.ok(interventionService.cloturer(id, dto));
    }
}