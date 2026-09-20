package com.mincom.gediibackend.entity;

import com.mincom.gediibackend.entity.enums.Role;
import com.mincom.gediibackend.entity.enums.StatutCompte;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String matricule;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String poste;

    private String telephone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_compte", nullable = false)
    private StatutCompte statutCompte = StatutCompte.EN_ATTENTE;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();
}