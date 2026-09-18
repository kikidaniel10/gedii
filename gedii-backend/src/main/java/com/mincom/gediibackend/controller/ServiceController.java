package com.mincom.gediibackend.controller;

import com.mincom.gediibackend.entity.Service;
import com.mincom.gediibackend.repository.ServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceRepository serviceRepository;
    private static final String CHARS = "0123456789ABCDEF";

    public ServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public ResponseEntity<List<Service>> getAll() {
        return ResponseEntity.ok(serviceRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Service> create(@RequestBody Map<String, String> body) {
        Service service = new Service();
        service.setNom(body.get("nom"));
        service.setCleAcces(genererCle());
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new IllegalArgumentException("Service introuvable");
        }
        try {
            serviceRepository.deleteById(id);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de supprimer ce service : des utilisateurs y sont déjà rattachés");
        }
        return ResponseEntity.ok(Map.of("message", "Service supprimé"));
    }

    private String genererCle() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder("SRV-");
        for (int i = 0; i < 6; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}