package com.mincom.gediibackend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.mincom.gediibackend.dto.statistique.PerformanceTechnicienDTO;
import com.mincom.gediibackend.dto.statistique.StatistiqueResponseDTO;
import com.mincom.gediibackend.entity.Intervention;
import com.mincom.gediibackend.entity.TechnicienInfo;
import com.mincom.gediibackend.repository.InterventionRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RapportStatistiqueService {

    private final StatistiqueService statistiqueService;
    private final InterventionRepository interventionRepository;

    public RapportStatistiqueService(StatistiqueService statistiqueService,
                                     InterventionRepository interventionRepository) {
        this.statistiqueService = statistiqueService;
        this.interventionRepository = interventionRepository;
    }

    public byte[] genererRapportStatistiques() throws Exception {
        StatistiqueResponseDTO stats = statistiqueService.getStatistiques();
        List<PerformanceTechnicienDTO> performance = statistiqueService.getPerformanceTechniciens();

        // Toutes les interventions groupées par technicien, triées alphabétiquement
        List<Intervention> toutesInterventions = interventionRepository.findAll();
        Map<String, List<Intervention>> parTechnicien = toutesInterventions.stream()
                .filter(i -> i.getTechnicien() != null)
                .collect(Collectors.groupingBy(
                        i -> i.getTechnicien().getNom(),
                        java.util.TreeMap::new,
                        Collectors.toList()
                ));

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 50);
        PdfWriter.getInstance(document, outputStream);

        document.open();

        // ===== EN-TÊTE BILINGUE =====
        PdfPTable header = new PdfPTable(3);
        header.setWidthPercentage(100);
        header.setWidths(new float[]{4f, 1.5f, 4f});

        Font smallBold = new Font(Font.HELVETICA, 8, Font.BOLD, Color.BLACK);
        Font smallItalic = new Font(Font.HELVETICA, 7, Font.ITALIC, Color.DARK_GRAY);
        Font tiny = new Font(Font.HELVETICA, 7, Font.NORMAL, Color.DARK_GRAY);

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
            System.out.println("###### Logo non trouvé : " + e.getMessage());
        }

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

        Paragraph separator = new Paragraph();
        separator.add(new Chunk("____________________________________________________________________________", tiny));
        separator.setAlignment(Element.ALIGN_CENTER);
        document.add(separator);

        document.add(new Paragraph(" ", tiny));

        // ===== TITRE =====
        Font titleFont = new Font(Font.HELVETICA, 15, Font.BOLD, new Color(11, 110, 79));
        Font titleFontEn = new Font(Font.HELVETICA, 11, Font.BOLD, new Color(11, 110, 79));

        Paragraph titreFr = new Paragraph("RAPPORT STATISTIQUE GLOBAL", titleFont);
        titreFr.setAlignment(Element.ALIGN_CENTER);
        document.add(titreFr);

        Paragraph titreEn = new Paragraph("GLOBAL STATISTICAL REPORT", titleFontEn);
        titreEn.setAlignment(Element.ALIGN_CENTER);
        document.add(titreEn);

        document.add(new Paragraph(" ", tiny));

        Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.BLACK);
        Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);
        Font sectionFont = new Font(Font.HELVETICA, 12, Font.BOLD, new Color(11, 110, 79));

        // ===== KPI =====
        addSectionTitle(document, "1. Indicateurs clés / Key indicators", sectionFont);

        PdfPTable kpiTable = new PdfPTable(2);
        kpiTable.setWidthPercentage(100);
        kpiTable.setWidths(new float[]{3f, 1.5f});

        addKpiRow(kpiTable, "Demandes totales / Total requests", String.valueOf(stats.getTotalDemandes()), boldFont, normalFont);
        addKpiRow(kpiTable, "En attente / Pending", String.valueOf(stats.getEnAttente()), boldFont, normalFont);
        addKpiRow(kpiTable, "En cours / In progress", String.valueOf(stats.getEnCours()), boldFont, normalFont);
        addKpiRow(kpiTable, "Résolues / Resolved", String.valueOf(stats.getResolues()), boldFont, normalFont);
        addKpiRow(kpiTable, "Rejetées / Rejected", String.valueOf(stats.getRejetees()), boldFont, normalFont);
        addKpiRow(kpiTable, "Taux de résolution / Resolution rate",
                Math.round(stats.getTauxResolution()) + " %", boldFont, normalFont);
        addKpiRow(kpiTable, "Délai moyen / Average delay",
                Math.round(stats.getDelaiMoyenHeures()) + " h", boldFont, normalFont);

        document.add(kpiTable);

        // ===== DEMANDES PAR SERVICE =====
        if (stats.getDemandesParService() != null && !stats.getDemandesParService().isEmpty()) {
            addSectionTitle(document, "2. Demandes par service / Requests by department", sectionFont);

            PdfPTable serviceTable = new PdfPTable(2);
            serviceTable.setWidthPercentage(80);
            serviceTable.setWidths(new float[]{3f, 1f});

            addTableHeader(serviceTable, new String[]{"Service", "Total"}, boldFont);

            for (Map<String, Object> entry : stats.getDemandesParService()) {
                serviceTable.addCell(new PdfPCell(new Phrase(String.valueOf(entry.get("service")), normalFont)));
                PdfPCell c = new PdfPCell(new Phrase(String.valueOf(entry.get("total")), normalFont));
                c.setHorizontalAlignment(Element.ALIGN_CENTER);
                serviceTable.addCell(c);
            }

            document.add(serviceTable);
        }

        // ===== ÉVOLUTION MENSUELLE =====
        if (stats.getEvolutionMensuelle() != null && !stats.getEvolutionMensuelle().isEmpty()) {
            addSectionTitle(document, "3. Évolution mensuelle / Monthly evolution", sectionFont);

            PdfPTable evolTable = new PdfPTable(2);
            evolTable.setWidthPercentage(80);
            evolTable.setWidths(new float[]{3f, 1f});

            addTableHeader(evolTable, new String[]{"Mois / Month", "Demandes"}, boldFont);

            for (Map<String, Object> entry : stats.getEvolutionMensuelle()) {
                evolTable.addCell(new PdfPCell(new Phrase(String.valueOf(entry.get("mois")), normalFont)));
                PdfPCell c = new PdfPCell(new Phrase(String.valueOf(entry.get("demandes")), normalFont));
                c.setHorizontalAlignment(Element.ALIGN_CENTER);
                evolTable.addCell(c);
            }

            document.add(evolTable);
        }

        // ===== PERFORMANCE TECHNICIENS =====
        if (performance != null && !performance.isEmpty()) {
            addSectionTitle(document, "4. Performance des techniciens / Technicians performance", sectionFont);

            PdfPTable perfTable = new PdfPTable(3);
            perfTable.setWidthPercentage(100);
            perfTable.setWidths(new float[]{3f, 1.5f, 1.5f});

            addTableHeader(perfTable,
                    new String[]{"Technicien / Technician", "Résolues\nResolved", "Délai moyen\nAvg delay"},
                    boldFont);

            for (PerformanceTechnicienDTO p : performance) {
                perfTable.addCell(new PdfPCell(new Phrase(p.getNom(), normalFont)));
                PdfPCell c1 = new PdfPCell(new Phrase(String.valueOf(p.getInterventionsResolues()), normalFont));
                c1.setHorizontalAlignment(Element.ALIGN_CENTER);
                perfTable.addCell(c1);
                PdfPCell c2 = new PdfPCell(new Phrase(Math.round(p.getDelaiMoyenHeures()) + " h", normalFont));
                c2.setHorizontalAlignment(Element.ALIGN_CENTER);
                perfTable.addCell(c2);
            }

            document.add(perfTable);
        }

        // ===== DÉTAIL DES INTERVENTIONS PAR TECHNICIEN =====
        if (!parTechnicien.isEmpty()) {
            addSectionTitle(document, "5. Détail des interventions par technicien / Detailed interventions by technician", sectionFont);

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (Map.Entry<String, List<Intervention>> entry : parTechnicien.entrySet()) {
                String nomTech = entry.getKey();
                List<Intervention> interventions = entry.getValue();
                interventions.sort(Comparator.comparing(Intervention::getId));

                Paragraph nomParagraph = new Paragraph();
                nomParagraph.setSpacingBefore(10);
                nomParagraph.setSpacingAfter(4);
                nomParagraph.add(new Chunk(nomTech + "  ", boldFont));
                nomParagraph.add(new Chunk("(" + interventions.size() + " intervention" + (interventions.size() > 1 ? "s" : "") + ")", tiny));
                document.add(nomParagraph);

                PdfPTable techTable = new PdfPTable(5);
                techTable.setWidthPercentage(100);
                techTable.setWidths(new float[]{0.5f, 3f, 1.3f, 1.2f, 1.2f});

                addTableHeader(techTable,
                        new String[]{"#", "Titre / Title", "Statut\nStatus", "Début\nStart", "Fin\nEnd"},
                        boldFont);

                int idx = 1;
                for (Intervention it : interventions) {
                    techTable.addCell(new PdfPCell(new Phrase(String.valueOf(idx++), normalFont)));
                    techTable.addCell(new PdfPCell(new Phrase(it.getDemande().getTitre(), normalFont)));
                    techTable.addCell(new PdfPCell(new Phrase(traduireStatut(it.getStatut().name()), normalFont)));
                    techTable.addCell(new PdfPCell(new Phrase(
                            it.getDateDebut() != null ? it.getDateDebut().format(fmt) : "—", normalFont)));
                    techTable.addCell(new PdfPCell(new Phrase(
                            it.getDateFin() != null ? it.getDateFin().format(fmt) : "—", normalFont)));
                }

                document.add(techTable);
            }
        }

        // ===== RÉSUMÉ GLOBAL =====
        addSectionTitle(document, "6. Résumé global / Global summary", sectionFont);

        long totalInterventions = toutesInterventions.size();
        long totalTerminees = toutesInterventions.stream()
                .filter(i -> "TERMINEE".equals(i.getStatut().name()))
                .count();
        String topTechnicien = parTechnicien.isEmpty() ? "—" :
                parTechnicien.entrySet().stream()
                        .max(Comparator.comparingInt(e -> e.getValue().size()))
                        .map(Map.Entry::getKey)
                        .orElse("—");

        PdfPTable resumeTable = new PdfPTable(2);
        resumeTable.setWidthPercentage(100);
        resumeTable.setWidths(new float[]{3f, 1.5f});

        addKpiRow(resumeTable, "Nombre total d'interventions / Total interventions",
                String.valueOf(totalInterventions), boldFont, normalFont);
        addKpiRow(resumeTable, "Interventions terminées / Completed interventions",
                String.valueOf(totalTerminees), boldFont, normalFont);
        addKpiRow(resumeTable, "Nombre de techniciens actifs / Active technicians",
                String.valueOf(parTechnicien.size()), boldFont, normalFont);
        addKpiRow(resumeTable, "Technicien le plus actif / Most active technician",
                topTechnicien, boldFont, normalFont);

        document.add(resumeTable);

        document.add(new Paragraph(" ", tiny));

        // ===== PIED DE PAGE =====
        Paragraph pied = new Paragraph(
                "Rapport généré le / Report generated on " +
                        LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")),
                tiny);
        pied.setAlignment(Element.ALIGN_RIGHT);
        document.add(pied);

        document.close();
        return outputStream.toByteArray();
    }

    private void addSectionTitle(Document document, String titre, Font font) throws DocumentException {
        Paragraph p = new Paragraph(titre, font);
        p.setSpacingBefore(12);
        p.setSpacingAfter(6);
        document.add(p);
    }

    private void addTableHeader(PdfPTable table, String[] headers, Font bold) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, bold));
            cell.setBackgroundColor(new Color(230, 240, 235));
            cell.setPadding(6);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }

    private void addKpiRow(PdfPTable table, String label, String value, Font bold, Font normal) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, normal));
        cellLabel.setPadding(6);
        cellLabel.setBorderColor(new Color(200, 220, 210));
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, bold));
        cellValue.setPadding(6);
        cellValue.setHorizontalAlignment(Element.ALIGN_CENTER);
        cellValue.setBorderColor(new Color(200, 220, 210));
        table.addCell(cellValue);
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