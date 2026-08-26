package com.mincom.gediibackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(name = "cle_acces", nullable = false, unique = true)
    private String cleAcces;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();
}