package com.mincom.gediibackend.service;

import com.mincom.gediibackend.entity.Notification;
import com.mincom.gediibackend.entity.enums.StatutNotification;
import com.mincom.gediibackend.repository.NotificationRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class NotificationService {

    private final JavaMailSender mailSender;
    private final NotificationRepository notificationRepository;

    public NotificationService(JavaMailSender mailSender, NotificationRepository notificationRepository) {
        this.mailSender = mailSender;
        this.notificationRepository = notificationRepository;
    }

    /**
     * Envoie un email au format HTML.
     *
     * @param destinataire  l'adresse email du destinataire
     * @param sujet         le sujet de l'email
     * @param htmlContent   le contenu HTML du mail
     * @param texteFallback version texte brut (pour les clients qui n'affichent pas le HTML)
     */
    public void envoyer(String destinataire, String sujet, String htmlContent, String texteFallback) {
        System.out.println("###### ====== DEBUT ENVOI EMAIL ======");
        System.out.println("###### Destinataire : [" + destinataire + "]");
        System.out.println("###### Sujet        : [" + sujet + "]");

        Notification notification = new Notification();
        notification.setDestinataire(destinataire);
        notification.setSujet(sujet);
        notification.setMessage(texteFallback);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("GEDII - Cellule Informatique <ngdani116@gmail.com>");
            helper.setTo(destinataire);
            helper.setSubject(sujet);
            helper.setText(texteFallback, htmlContent);

            mailSender.send(message);

            notification.setStatut(StatutNotification.ENVOYEE);
            System.out.println("###### EMAIL ENVOYE AVEC SUCCES a " + destinataire);
        } catch (Exception e) {
            notification.setStatut(StatutNotification.ECHEC);
            System.out.println("###### ECHEC ENVOI EMAIL");
            System.out.println("###### Classe exception : " + e.getClass().getName());
            System.out.println("###### Message          : " + e.getMessage());
            e.printStackTrace();
        }

        try {
            notificationRepository.save(notification);
            System.out.println("###### Notification enregistree en base");
        } catch (Exception e) {
            System.out.println("###### Erreur sauvegarde notification : " + e.getMessage());
        }

        System.out.println("###### ====== FIN ENVOI EMAIL ======");
    }
}