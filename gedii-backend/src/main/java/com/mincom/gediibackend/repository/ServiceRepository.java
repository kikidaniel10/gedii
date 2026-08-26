package com.mincom.gediibackend.repository;

import com.mincom.gediibackend.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    Optional<Service> findByNom(String nom);

    boolean existsByNom(String nom);
}