package com.mincom.gediibackend.controller;

import com.mincom.gediibackend.dto.demande.DemandeRequestDTO;
import com.mincom.gediibackend.dto.demande.DemandeResponseDTO;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.service.DemandeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
public class DemandeController {

    private final DemandeService demandeService;

    public DemandeController(DemandeService demandeService) {
        this.demandeService = demandeService;
    }

    @PostMapping
    public ResponseEntity<DemandeResponseDTO> creer(@RequestBody DemandeRequestDTO dto,
                                                    @AuthenticationPrincipal Utilisateur agent) {
        return ResponseEntity.ok(demandeService.creer(dto, agent));
    }

    @GetMapping("/mes-demandes")
    public ResponseEntity<List<DemandeResponseDTO>> getMesDemandes(@AuthenticationPrincipal Utilisateur agent) {
        return ResponseEntity.ok(demandeService.getMesDemandes(agent));
    }

    @GetMapping("/en-attente")
    public ResponseEntity<List<DemandeResponseDTO>> getEnAttente() {
        return ResponseEntity.ok(demandeService.getEnAttente());
    }

    @GetMapping("/validees")
    public ResponseEntity<List<DemandeResponseDTO>> getValidees() {
        return ResponseEntity.ok(demandeService.getValidees());
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<DemandeResponseDTO> valider(@PathVariable Long id) {
        return ResponseEntity.ok(demandeService.valider(id));
    }

    @PutMapping("/{id}/rejeter")
    public ResponseEntity<DemandeResponseDTO> rejeter(@PathVariable Long id) {
        return ResponseEntity.ok(demandeService.rejeter(id));
    }
}