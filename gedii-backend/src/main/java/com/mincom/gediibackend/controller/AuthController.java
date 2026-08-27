package com.mincom.gediibackend.controller;

import com.mincom.gediibackend.dto.auth.LoginRequestDTO;
import com.mincom.gediibackend.dto.auth.LoginResponseDTO;
import com.mincom.gediibackend.dto.auth.RegisterRequestDTO;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequestDTO dto) {
        Utilisateur utilisateur = authService.register(dto);
        return ResponseEntity.ok(Map.of(
                "message", "Compte créé avec succès, en attente de validation par le responsable",
                "matricule", utilisateur.getMatricule()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        LoginResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}