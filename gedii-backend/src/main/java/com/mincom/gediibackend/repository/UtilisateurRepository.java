package com.mincom.gediibackend.repository;

import com.mincom.gediibackend.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByMatricule(String matricule);

    boolean existsByRole(com.mincom.gediibackend.entity.enums.Role role);

    java.util.List<Utilisateur> findByStatutCompte(com.mincom.gediibackend.entity.enums.StatutCompte statut);

    java.util.List<Utilisateur> findByRole(com.mincom.gediibackend.entity.enums.Role role);
}