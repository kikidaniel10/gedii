package com.mincom.gediibackend.entity;

import com.mincom.gediibackend.entity.enums.StatutDemande;
import com.mincom.gediibackend.entity.enums.Urgence;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "demandes")
@Getter
@Setter
@NoArgsConstructor
public class Demande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDemande statut = StatutDemande.EN_ATTENTE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgence urgence;

    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private Utilisateur agent;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;
}