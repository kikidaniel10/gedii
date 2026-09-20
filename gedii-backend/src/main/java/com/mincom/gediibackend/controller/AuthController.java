package com.mincom.gediibackend.controller;

import com.mincom.gediibackend.dto.auth.LoginRequestDTO;
import com.mincom.gediibackend.dto.auth.LoginResponseDTO;
import com.mincom.gediibackend.dto.auth.RegisterRequestDTO;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> register(
            @RequestParam("nom") String nom,
            @RequestParam("matricule") String matricule,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("serviceNom") String serviceNom,
            @RequestParam("cleAcces") String cleAcces,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {

        RegisterRequestDTO dto = new RegisterRequestDTO();
        dto.setNom(nom);
        dto.setMatricule(matricule);
        dto.setEmail(email);
        dto.setPassword(password);
        dto.setServiceNom(serviceNom);
        dto.setCleAcces(cleAcces);

        Utilisateur utilisateur = authService.register(dto, photo);

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