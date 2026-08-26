package com.mincom.gediibackend.repository;

import com.mincom.gediibackend.entity.Intervention;
import com.mincom.gediibackend.entity.TechnicienInfo;
import com.mincom.gediibackend.entity.enums.StatutIntervention;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {

    List<Intervention> findByTechnicienAndStatut(TechnicienInfo technicien, StatutIntervention statut);

    List<Intervention> findByTechnicien(TechnicienInfo technicien);
}