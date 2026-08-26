package com.mincom.gediibackend.repository;

import com.mincom.gediibackend.entity.Demande;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.entity.enums.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DemandeRepository extends JpaRepository<Demande, Long> {

    List<Demande> findByStatut(StatutDemande statut);

    List<Demande> findByAgent(Utilisateur agent);
}