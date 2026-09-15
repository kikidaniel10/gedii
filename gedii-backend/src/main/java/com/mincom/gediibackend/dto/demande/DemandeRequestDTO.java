package com.mincom.gediibackend.dto.demande;

import com.mincom.gediibackend.entity.enums.Urgence;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DemandeRequestDTO {
    private String titre;
    private String description;
    private Urgence urgence;
}