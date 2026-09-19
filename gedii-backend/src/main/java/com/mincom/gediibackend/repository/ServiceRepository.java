package com.mincom.gediibackend.repository;

import com.mincom.gediibackend.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    Optional<Service> findByNom(String nom);

    boolean existsByNom(String nom);

    @Query("SELECT s FROM Service s WHERE LOWER(TRIM(s.nom)) = LOWER(TRIM(:nom))")
    Optional<Service> findByNomIgnoreCase(@Param("nom") String nom);
}