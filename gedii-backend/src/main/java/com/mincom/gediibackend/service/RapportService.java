package com.mincom.gediibackend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.mincom.gediibackend.entity.Intervention;
import com.mincom.gediibackend.entity.TechnicienInfo;
import com.mincom.gediibackend.repository.InterventionRepository;
import jakarta.persistence.EntityManager;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RapportService {

    private final InterventionRepository interventionRepository;
    private final EntityManager entityManager;

    public RapportService(InterventionRepository interventionRepository, EntityManager entityManager) {
        this.interventionRepository = interventionRepository;
        this.entityManager = entityManager;
    }

    public byte[] genererRapportTechnicien(Long technicienId) throws Exception {
        TechnicienInfo technicien = entityManager.find(TechnicienInfo.class, technicienId);
        if (technicien == null) {
            throw new IllegalArgumentException("Technicien introuvable");
        }

        List<Intervention> interventions = interventionRepository.findByTechnicien(technicien);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 50);
        PdfWriter.getInstance(document, outputStream);

        document.open();

        // ===== EN-TÊTE BILINGUE AVEC ARMOIRIES =====
        PdfPTable header = new PdfPTable(3);
        header.setWidthPercentage(100);
        header.setWidths(new float[]{4f, 1.5f, 4f});

        Font smallBold = new Font(Font.HELVETICA, 8, Font.BOLD, Color.BLACK);
        Font smallItalic = new Font(Font.HELVETICA, 7, Font.ITALIC, Color.DARK_GRAY);
        Font tiny = new Font(Font.HELVETICA, 7, Font.NORMAL, Color.DARK_GRAY);

        // Colonne gauche : Français
        PdfPCell cellFr = new PdfPCell();
        cellFr.setBorder(Rectangle.NO_BORDER);
        cellFr.setPadding(0);
        Paragraph fr = new Paragraph();
        fr.add(new Chunk("RÉPUBLIQUE DU CAMEROUN\n", smallBold));
        fr.add(new Chunk("Paix - Travail - Patrie\n", smallItalic));
        fr.add(new Chunk("-------\n", tiny));
        fr.add(new Chunk("MINISTÈRE DE LA COMMUNICATION\n", smallBold));
        fr.add(new Chunk("Cellule Informatique\n", tiny));
        fr.add(new Chunk("GEDII", tiny));
        cellFr.addElement(fr);

        // Colonne centrale : Armoiries
        PdfPCell cellLogo = new PdfPCell();
        cellLogo.setBorder(Rectangle.NO_BORDER);
        cellLogo.setHorizontalAlignment(Element.ALIGN_CENTER);
        cellLogo.setVerticalAlignment(Element.ALIGN_MIDDLE);
        try {
            ClassPathResource logoResource = new ClassPathResource("coat-of-arms.png");
            Image logo = Image.getInstance(logoResource.getURL());
            logo.scaleToFit(60, 60);
            cellLogo.addElement(logo);
        } catch (Exception e) {
            // Si l'image manque, on continue sans
            System.out.println("###### Logo non trouvé : " + e.getMessage());
        }

        // Colonne droite : Anglais
        PdfPCell cellEn = new PdfPCell();
        cellEn.setBorder(Rectangle.NO_BORDER);
        cellEn.setPadding(0);
        Paragraph en = new Paragraph();
        en.setAlignment(Element.ALIGN_RIGHT);
        en.add(new Chunk("REPUBLIC OF CAMEROON\n", smallBold));
        en.add(new Chunk("Peace - Work - Fatherland\n", smallItalic));
        en.add(new Chunk("-------\n", tiny));
        en.add(new Chunk("MINISTRY OF COMMUNICATION\n", smallBold));
        en.add(new Chunk("Computer Unit\n", tiny));
        en.add(new Chunk("GEDII", tiny));
        cellEn.addElement(en);

        header.addCell(cellFr);
        header.addCell(cellLogo);
        header.addCell(cellEn);
        document.add(header);

        document.add(new Paragraph(" ", tiny));

        // Ligne de séparation
        Paragraph separator = new Paragraph();
        separator.add(new Chunk("____________________________________________________________________________", tiny));
        separator.setAlignment(Element.ALIGN_CENTER);
        document.add(separator);

        document.add(new Paragraph(" ", tiny));

        // ===== TITRE BILINGUE =====
        Font titleFont = new Font(Font.HELVETICA, 15, Font.BOLD, new Color(11, 110, 79));
        Font titleFontEn = new Font(Font.HELVETICA, 11, Font.BOLD, new Color(11, 110, 79));

        Paragraph titreFr = new Paragraph("RAPPORT D'INTERVENTIONS", titleFont);
        titreFr.setAlignment(Element.ALIGN_CENTER);
        document.add(titreFr);

        Paragraph titreEn = new Paragraph("INTERVENTIONS REPORT", titleFontEn);
        titreEn.setAlignment(Element.ALIGN_CENTER);
        document.add(titreEn);

        document.add(new Paragraph(" ", tiny));

        // ===== INFOS TECHNICIEN (bilingue) =====
        Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.BLACK);
        Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);

        Paragraph techInfo = new Paragraph();
        techInfo.add(new Chunk("Technicien / Technician : ", boldFont));
        techInfo.add(new Chunk(technicien.getNom(), normalFont));
        techInfo.add(Chunk.NEWLINE);
        techInfo.add(new Chunk("Matricule / ID : ", boldFont));
        techInfo.add(new Chunk(technicien.getMatricule(), normalFont));
        techInfo.add(Chunk.NEWLINE);
        techInfo.add(new Chunk("Spécialité / Speciality : ", boldFont));
        techInfo.add(new Chunk(technicien.getSpecialite() != null ? technicien.getSpecialite() : "—", normalFont));
        techInfo.add(Chunk.NEWLINE);
        techInfo.add(new Chunk("Nombre total d'interventions / Total interventions : ", boldFont));
        techInfo.add(new Chunk(String.valueOf(interventions.size()), normalFont));
        document.add(techInfo);

        document.add(new Paragraph(" ", tiny));

        // ===== TABLEAU =====
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.5f, 3f, 1.3f, 1.4f, 3.8f});

        String[] headers = {"#", "Titre / Title", "Statut\nStatus", "Date début\nStart date", "Compte-rendu / Report"};
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
            cell.setBackgroundColor(new Color(230, 240, 235));
            cell.setPadding(6);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        int index = 1;
        for (Intervention it : interventions) {
            table.addCell(new PdfPCell(new Phrase(String.valueOf(index++), normalFont)));
            table.addCell(new PdfPCell(new Phrase(it.getDemande().getTitre(), normalFont)));
            table.addCell(new PdfPCell(new Phrase(traduireStatut(it.getStatut().name()), normalFont)));
            table.addCell(new PdfPCell(new Phrase(
                    it.getDateDebut() != null ? it.getDateDebut().format(fmt) : "—", normalFont)));
            table.addCell(new PdfPCell(new Phrase(
                    it.getCompteRendu() != null && !it.getCompteRendu().isEmpty() ? it.getCompteRendu() : "—",
                    normalFont)));
        }

        document.add(table);

        document.add(new Paragraph(" ", tiny));

        // ===== PIED DE PAGE =====
        Paragraph pied = new Paragraph(
                "Rapport généré le / Report generated on " +
                        java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")),
                tiny);
        pied.setAlignment(Element.ALIGN_RIGHT);
        document.add(pied);

        document.close();
        return outputStream.toByteArray();
    }

    private String traduireStatut(String statut) {
        return switch (statut) {
            case "ASSIGNEE" -> "À démarrer / To start";
            case "EN_COURS" -> "En cours / In progress";
            case "TERMINEE" -> "Terminée / Done";
            default -> statut;
        };
    }
}