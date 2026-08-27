package com.mincom.gediibackend.dto.auth;

import com.mincom.gediibackend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String nom;
    private String matricule;
    private Role role;
}