package com.mincom.gediibackend.service;

import com.mincom.gediibackend.dto.auth.LoginRequestDTO;
import com.mincom.gediibackend.dto.auth.LoginResponseDTO;
import com.mincom.gediibackend.dto.auth.RegisterRequestDTO;
import com.mincom.gediibackend.entity.Service;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.entity.enums.Role;
import com.mincom.gediibackend.entity.enums.StatutCompte;
import com.mincom.gediibackend.repository.ServiceRepository;
import com.mincom.gediibackend.repository.UtilisateurRepository;
import com.mincom.gediibackend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UtilisateurRepository utilisateurRepository,
                       ServiceRepository serviceRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.utilisateurRepository = utilisateurRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Utilisateur register(RegisterRequestDTO dto) {
        if (utilisateurRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }
        if (utilisateurRepository.existsByMatricule(dto.getMatricule())) {
            throw new IllegalArgumentException("Ce matricule est déjà utilisé");
        }

        Service service = serviceRepository.findByNom(dto.getServiceNom())
                .orElseThrow(() -> new IllegalArgumentException("Service introuvable"));

        if (!service.getCleAcces().equals(dto.getCleAcces())) {
            throw new IllegalArgumentException("Clé d'accès invalide pour ce service");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(dto.getNom());
        utilisateur.setMatricule(dto.getMatricule());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setPassword(passwordEncoder.encode(dto.getPassword()));
        utilisateur.setService(service);
        utilisateur.setRole(Role.AGENT);
        utilisateur.setStatutCompte(StatutCompte.EN_ATTENTE);

        return utilisateurRepository.save(utilisateur);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Identifiants incorrects"));

        if (!passwordEncoder.matches(dto.getPassword(), utilisateur.getPassword())) {
            throw new IllegalArgumentException("Identifiants incorrects");
        }

        if (utilisateur.getStatutCompte() == StatutCompte.EN_ATTENTE) {
            throw new IllegalStateException("Compte en attente de validation par le responsable");
        }
        if (utilisateur.getStatutCompte() == StatutCompte.REJETE) {
            throw new IllegalStateException("Compte rejeté");
        }

        String token = jwtUtil.generateToken(utilisateur);

        return new LoginResponseDTO(token, utilisateur.getNom(), utilisateur.getMatricule(), utilisateur.getRole());
    }
}