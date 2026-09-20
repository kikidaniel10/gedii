package com.mincom.gediibackend.service;

import com.mincom.gediibackend.entity.Notification;
import com.mincom.gediibackend.entity.enums.StatutNotification;
import com.mincom.gediibackend.repository.NotificationRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class NotificationService {

    private final JavaMailSender mailSender;
    private final NotificationRepository notificationRepository;

    public NotificationService(JavaMailSender mailSender, NotificationRepository notificationRepository) {
        this.mailSender = mailSender;
        this.notificationRepository = notificationRepository;
    }

    public void envoyer(String destinataire, String sujet, String message) {
        System.out.println("###### ====== DEBUT ENVOI EMAIL ======");
        System.out.println("###### Destinataire : [" + destinataire + "]");
        System.out.println("###### Sujet        : [" + sujet + "]");

        Notification notification = new Notification();
        notification.setDestinataire(destinataire);
        notification.setSujet(sujet);
        notification.setMessage(message);

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(destinataire);
            mail.setSubject(sujet);
            mail.setText(message);
            mailSender.send(mail);
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