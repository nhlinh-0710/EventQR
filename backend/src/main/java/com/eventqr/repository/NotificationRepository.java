package com.eventqr.repository;

import com.eventqr.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Lấy tất cả thông báo của một user
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Lấy thông báo chưa đọc của một user
    List<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Notification.NotificationStatus status);
    
    // Đếm số thông báo chưa đọc
    long countByUserIdAndStatus(Long userId, Notification.NotificationStatus status);
}

