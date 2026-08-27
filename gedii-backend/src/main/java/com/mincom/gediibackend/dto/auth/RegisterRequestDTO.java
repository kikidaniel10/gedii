package com.mincom.gediibackend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {
    private String nom;
    private String matricule;
    private String email;
    private String password;
    private String serviceNom;
    private String cleAcces;
}