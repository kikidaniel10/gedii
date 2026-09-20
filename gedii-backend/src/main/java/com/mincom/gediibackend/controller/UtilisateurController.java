package com.mincom.gediibackend.controller;

import com.mincom.gediibackend.dto.UtilisateurResponseDTO;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping("/en-attente")
    public ResponseEntity<List<UtilisateurResponseDTO>> getEnAttente() {
        return ResponseEntity.ok(utilisateurService.getEnAttente());
    }

    @GetMapping("/actifs")
    public ResponseEntity<List<UtilisateurResponseDTO>> getActifs() {
        return ResponseEntity.ok(utilisateurService.getActifs());
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<UtilisateurResponseDTO> valider(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.valider(id));
    }

    @PutMapping("/{id}/rejeter")
    public ResponseEntity<UtilisateurResponseDTO> rejeter(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.rejeter(id));
    }

    @PutMapping("/{id}/promouvoir-technicien")
    public ResponseEntity<UtilisateurResponseDTO> promouvoirTechnicien(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(utilisateurService.promouvoirTechnicien(id, body.get("specialite")));
    }

    @GetMapping("/techniciens")
    public ResponseEntity<List<UtilisateurResponseDTO>> getTechniciens() {
        return ResponseEntity.ok(utilisateurService.getTechniciens());
    }

    @GetMapping("/me")
    public ResponseEntity<UtilisateurResponseDTO> getMe(@AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(utilisateurService.getMe(utilisateur.getId()));
    }

    @PostMapping("/me/photo")
    public ResponseEntity<UtilisateurResponseDTO> uploadPhoto(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(utilisateurService.updatePhoto(utilisateur.getId(), file));
    }

    @DeleteMapping("/me/photo")
    public ResponseEntity<UtilisateurResponseDTO> deletePhoto(@AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(utilisateurService.deletePhoto(utilisateur.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> supprimer(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Utilisateur responsable) {
        utilisateurService.supprimer(id, body.get("password"), responsable.getId());
        return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé avec succès"));
    }
}