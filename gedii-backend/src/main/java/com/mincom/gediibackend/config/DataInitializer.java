package com.mincom.gediibackend.config;

import com.mincom.gediibackend.entity.Service;
import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.entity.enums.Role;
import com.mincom.gediibackend.entity.enums.StatutCompte;
import com.mincom.gediibackend.repository.ServiceRepository;
import com.mincom.gediibackend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${responsable.init.email}")
    private String responsableEmail;

    @Value("${responsable.init.password}")
    private String responsablePassword;

    @Value("${responsable.init.nom}")
    private String responsableNom;

    @Value("${responsable.init.matricule}")
    private String responsableMatricule;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                           ServiceRepository serviceRepository,
                           PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (utilisateurRepository.existsByRole(Role.RESPONSABLE)) {
            return;
        }

        Service serviceDirection = serviceRepository.findByNom("Direction Generale")
                .orElseGet(() -> {
                    Service s = new Service();
                    s.setNom("Direction Generale");
                    s.setCleAcces("ADMIN-INIT");
                    return serviceRepository.save(s);
                });

        Utilisateur responsable = new Utilisateur();
        responsable.setNom(responsableNom);
        responsable.setMatricule(responsableMatricule);
        responsable.setEmail(responsableEmail);
        responsable.setPassword(passwordEncoder.encode(responsablePassword));
        responsable.setService(serviceDirection);
        responsable.setRole(Role.RESPONSABLE);
        responsable.setStatutCompte(StatutCompte.ACTIF);

        utilisateurRepository.save(responsable);

        System.out.println("=================================================");
        System.out.println("Compte Responsable initial cree : " + responsableEmail);
        System.out.println("=================================================");
    }
}