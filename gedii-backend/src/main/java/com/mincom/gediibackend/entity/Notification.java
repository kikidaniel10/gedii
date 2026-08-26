package com.mincom.gediibackend.entity;

import com.mincom.gediibackend.entity.enums.StatutNotification;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String destinataire;

    private String sujet;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutNotification statut;

    @ManyToOne
    @JoinColumn(name = "demande_id")
    private Demande demande;

    @Column(name = "date_envoi")
    private LocalDateTime dateEnvoi = LocalDateTime.now();
}