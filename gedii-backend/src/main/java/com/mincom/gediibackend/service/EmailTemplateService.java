package com.mincom.gediibackend.service;

import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    private static final String LOGO_URL = "https://ddhctspoizjclwjnmgkz.supabase.co/storage/v1/object/public/email-assets/coat-of-arms.png";
    private static final String PRIMARY = "#0B6E4F";
    private static final String PRIMARY_DARK = "#095637";
    private static final String GOLD = "#FCD116";
    private static final String RED = "#CE1126";

    public String activationCompte(String nom, String loginUrl) {
        String contenu = "<p style=\"font-size:16px;color:#1a1a1a;margin:0 0 16px 0;\">Bonjour <strong>" + nom + "</strong>,</p>"
                + "<p style=\"font-size:15px;color:#3a3a3a;line-height:1.6;margin:0 0 20px 0;\">"
                + "Nous avons le plaisir de vous informer que votre compte sur la plateforme <strong>GEDII</strong> "
                + "a été <span style=\"color:" + PRIMARY + ";font-weight:600;\">validé par le responsable</span> de la cellule informatique."
                + "</p>"
                + "<p style=\"font-size:15px;color:#3a3a3a;line-height:1.6;margin:0 0 24px 0;\">"
                + "Vous pouvez dès maintenant vous connecter et commencer à utiliser l'application."
                + "</p>"
                + bouton("Accéder à GEDII", loginUrl)
                + "<p style=\"font-size:13px;color:#7a7a7a;line-height:1.5;margin:24px 0 0 0;\">"
                + "Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>"
                + "<a href=\"" + loginUrl + "\" style=\"color:" + PRIMARY + ";word-break:break-all;\">" + loginUrl + "</a>"
                + "</p>";

        return wrapper("Compte activé", "Votre compte GEDII a été activé", contenu);
    }

    public String validationDemande(String nomAgent, String titreDemande, String loginUrl) {
        String contenu = "<p style=\"font-size:16px;color:#1a1a1a;margin:0 0 16px 0;\">Bonjour <strong>" + nomAgent + "</strong>,</p>"
                + "<p style=\"font-size:15px;color:#3a3a3a;line-height:1.6;margin:0 0 20px 0;\">"
                + "Nous avons le plaisir de vous informer que votre demande a été "
                + "<span style=\"color:" + PRIMARY + ";font-weight:600;\">validée par le responsable</span>."
                + "</p>"
                + "<div style=\"background:#f5faf7;border-left:4px solid " + PRIMARY + ";padding:16px 20px;border-radius:6px;margin:0 0 24px 0;\">"
                + "<p style=\"font-size:13px;color:#7a7a7a;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;\">Demande validée</p>"
                + "<p style=\"font-size:16px;color:#1a1a1a;font-weight:600;margin:0;\">" + titreDemande + "</p>"
                + "</div>"
                + "<p style=\"font-size:15px;color:#3a3a3a;line-height:1.6;margin:0 0 24px 0;\">"
                + "Elle sera bientôt assignée à un technicien qui traitera votre requête."
                + "</p>"
                + bouton("Suivre ma demande", loginUrl);

        return wrapper("Demande validée", "Votre demande a été validée", contenu);
    }

    public String assignationIntervention(String nomTechnicien, String titreDemande, String loginUrl) {
        String contenu = "<p style=\"font-size:16px;color:#1a1a1a;margin:0 0 16px 0;\">Bonjour <strong>" + nomTechnicien + "</strong>,</p>"
                + "<p style=\"font-size:15px;color:#3a3a3a;line-height:1.6;margin:0 0 20px 0;\">"
                + "Une nouvelle intervention vous a été assignée par le responsable."
                + "</p>"
                + "<div style=\"background:#f5faf7;border-left:4px solid " + PRIMARY + ";padding:16px 20px;border-radius:6px;margin:0 0 24px 0;\">"
                + "<p style=\"font-size:13px;color:#7a7a7a;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;\">Demande concernée</p>"
                + "<p style=\"font-size:16px;color:#1a1a1a;font-weight:600;margin:0;\">" + titreDemande + "</p>"
                + "</div>"
                + "<p style=\"font-size:15px;color:#3a3a3a;line-height:1.6;margin:0 0 24px 0;\">"
                + "Connectez-vous à la plateforme pour consulter les détails et démarrer le traitement."
                + "</p>"
                + bouton("Voir l'intervention", loginUrl);

        return wrapper("Nouvelle intervention", "Nouvelle intervention assignée", contenu);
    }

    public String resolutionDemande(String nomAgent, String titreDemande, String compteRendu, String loginUrl) {
        String contenu = "<p style=\"font-size:16px;color:#1a1a1a;margin:0 0 16px 0;\">Bonjour <strong>" + nomAgent + "</strong>,</p>"
                + "<p style=\"font-size:15px;color:#3a3a3a;line-height:1.6;margin:0 0 20px 0;\">"
                + "Nous avons le plaisir de vous informer que votre demande a été "
                + "<span style=\"color:" + PRIMARY + ";font-weight:600;\">résolue par notre technicien</span>."
                + "</p>"
                + "<div style=\"background:#f5faf7;border-left:4px solid " + PRIMARY + ";padding:16px 20px;border-radius:6px;margin:0 0 20px 0;\">"
                + "<p style=\"font-size:13px;color:#7a7a7a;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;\">Demande</p>"
                + "<p style=\"font-size:16px;color:#1a1a1a;font-weight:600;margin:0 0 12px 0;\">" + titreDemande + "</p>"
                + "<p style=\"font-size:13px;color:#7a7a7a;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;\">Compte-rendu</p>"
                + "<p style=\"font-size:14px;color:#3a3a3a;line-height:1.6;margin:0;\">" + compteRendu + "</p>"
                + "</div>"
                + bouton("Consulter ma demande", loginUrl);

        return wrapper("Demande résolue", "Votre demande a été résolue", contenu);
    }

    private String bouton(String texte, String url) {
        return "<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"margin:0 auto;\">"
                + "<tr><td style=\"border-radius:8px;background:" + PRIMARY + ";\">"
                + "<a href=\"" + url + "\" target=\"_blank\" "
                + "style=\"display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;"
                + "color:#ffffff;text-decoration:none;border-radius:8px;\">" + texte + "</a>"
                + "</td></tr></table>";
    }

    private String wrapper(String titre, String previewText, String contenu) {
        return "<!DOCTYPE html>"
                + "<html lang=\"fr\"><head><meta charset=\"UTF-8\">"
                + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">"
                + "<title>" + titre + "</title></head>"
                + "<body style=\"margin:0;padding:0;background:#f4f6f5;font-family:Arial,Helvetica,sans-serif;\">"
                + "<div style=\"display:none;font-size:1px;color:#f4f6f5;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;\">"
                + previewText + "</div>"
                + "<table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background:#f4f6f5;\">"
                + "<tr><td align=\"center\" style=\"padding:32px 16px;\">"

                // Container principal
                + "<table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" "
                + "style=\"max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;"
                + "box-shadow:0 4px 24px rgba(0,0,0,0.08);\">"

                // Bandeau tricolore (haut)
                + "<tr><td style=\"height:5px;background:linear-gradient(to right," + PRIMARY + " 0%," + PRIMARY + " 33%," + RED + " 33%," + RED + " 66%," + GOLD + " 66%," + GOLD + " 100%);\"></td></tr>"

                // En-tête avec logo + titre ministère
                + "<tr><td style=\"background:#ffffff;padding:28px 32px 20px 32px;border-bottom:1px solid #e8ece9;\">"
                + "<table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">"
                + "<tr>"
                + "<td width=\"60\" valign=\"middle\"><img src=\"" + LOGO_URL + "\" alt=\"Armoiries\" width=\"52\" height=\"52\" style=\"display:block;border:0;\"></td>"
                + "<td valign=\"middle\" style=\"padding-left:16px;\">"
                + "<p style=\"margin:0;font-size:12px;font-weight:700;color:" + PRIMARY + ";letter-spacing:0.5px;\">RÉPUBLIQUE DU CAMEROUN</p>"
                + "<p style=\"margin:2px 0 0 0;font-size:11px;color:#7a7a7a;font-style:italic;\">Paix — Travail — Patrie</p>"
                + "<p style=\"margin:6px 0 0 0;font-size:12px;font-weight:700;color:#1a1a1a;\">MINISTÈRE DE LA COMMUNICATION</p>"
                + "</td>"
                + "</tr></table>"
                + "</td></tr>"

                // Titre principal
                + "<tr><td style=\"background:" + PRIMARY + ";padding:20px 32px;\">"
                + "<h1 style=\"margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.3px;\">" + titre + "</h1>"
                + "<p style=\"margin:6px 0 0 0;font-size:12px;color:rgba(255,255,255,0.85);\">GEDII — Gestion des Demandes et Interventions Informatiques</p>"
                + "</td></tr>"

                // Contenu
                + "<tr><td style=\"padding:32px;\">" + contenu + "</td></tr>"

                // Pied de page
                + "<tr><td style=\"background:#fafbfa;padding:20px 32px;border-top:1px solid #e8ece9;\">"
                + "<p style=\"margin:0 0 6px 0;font-size:12px;color:#7a7a7a;text-align:center;\">"
                + "Cet email a été envoyé automatiquement par la plateforme GEDII."
                + "</p>"
                + "<p style=\"margin:0;font-size:11px;color:#a0a0a0;text-align:center;\">"
                + "Cellule Informatique — Ministère de la Communication<br>"
                + "Merci de ne pas répondre à cet email."
                + "</p>"
                + "</td></tr>"

                + "</table>" // fin container
                + "<p style=\"margin:16px 0 0 0;font-size:11px;color:#a0a0a0;text-align:center;\">"
                + "© " + java.time.Year.now().getValue() + " GEDII — MINCOM"
                + "</p>"
                + "</td></tr></table>"
                + "</body></html>";
    }
}