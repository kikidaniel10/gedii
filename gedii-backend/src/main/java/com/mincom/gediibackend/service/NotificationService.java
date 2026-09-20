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
        System.out.println("###### ENVOI EMAIL → destinataire = [" + destinataire + "]");
        System.out.println("###### SUJET = [" + sujet + "]");

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
            System.out.println("###### ECHEC ENVOI EMAIL : " + e.getClass().getName());
            System.out.println("###### MESSAGE : " + e.getMessage());
            e.printStackTrace();
        }

        notificationRepository.save(notification);
    }
}