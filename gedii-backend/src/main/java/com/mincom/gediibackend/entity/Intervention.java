package com.mincom.gediibackend.entity;

import com.mincom.gediibackend.entity.enums.StatutIntervention;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "interventions")
@Getter
@Setter
@NoArgsConstructor
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutIntervention statut = StatutIntervention.ASSIGNEE;

    @Column(name = "compte_rendu", columnDefinition = "TEXT")
    private String compteRendu;

    @OneToOne
    @JoinColumn(name = "demande_id", nullable = false, unique = true)
    private Demande demande;

    @ManyToOne
    @JoinColumn(name = "technicien_id", nullable = false)
    private TechnicienInfo technicien;

    @Column(name = "date_debut")
    private LocalDateTime dateDebut = LocalDateTime.now();

    @Column(name = "date_fin")
    private LocalDateTime dateFin;
}