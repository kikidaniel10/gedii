package com.mincom.gediibackend.repository;

import com.mincom.gediibackend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}