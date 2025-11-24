package com.eventqr.service;

import com.eventqr.model.Notification;
import com.eventqr.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, 
                               SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Gửi thông báo realtime tới organizer khi có user đăng ký sự kiện
     * 
     * @param organizerId ID của organizer (người nhận thông báo)
     * @param eventId ID của sự kiện
     * @param eventTitle Tên sự kiện
     * @param userName Tên user đăng ký
     */
    @Transactional
    public void sendToOrganizer(Long organizerId, Long eventId, String eventTitle, String userName) {
        try {
            // Validate input
            if (organizerId == null || eventId == null || eventTitle == null || userName == null) {
                throw new IllegalArgumentException("Thông tin không đầy đủ để gửi thông báo");
            }

            // Tạo nội dung thông báo
            String message = String.format("User %s vừa đăng ký sự kiện %s", userName, eventTitle);
            String title = "Đăng ký sự kiện mới";

            // Lưu vào database
            Notification notification = new Notification();
            notification.setUserId(organizerId);
            notification.setEventId(eventId);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setStatus(Notification.NotificationStatus.unread);
            
            Notification savedNotification = notificationRepository.save(notification);

            // Tạo JSON response để gửi qua WebSocket
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("notificationId", savedNotification.getNotificationId());
            notificationData.put("userId", savedNotification.getUserId());
            notificationData.put("eventId", savedNotification.getEventId());
            notificationData.put("title", savedNotification.getTitle());
            notificationData.put("message", savedNotification.getMessage());
            notificationData.put("status", savedNotification.getStatus().name());
            notificationData.put("createdAt", savedNotification.getCreatedAt() != null 
                ? savedNotification.getCreatedAt().toString() 
                : java.time.LocalDateTime.now().toString());
            notificationData.put("type", "registration"); // Loại thông báo

            // Gửi thông báo realtime qua WebSocket tới topic: /topic/organizer/{organizerId}
            String destination = "/topic/organizer/" + organizerId;
            messagingTemplate.convertAndSend(destination, notificationData);
            
            System.out.println("✅ Đã gửi thông báo WebSocket tới: " + destination);
        } catch (Exception e) {
            // Log lỗi nhưng không throw để không ảnh hưởng đến quá trình đăng ký
            System.err.println("❌ Lỗi khi gửi thông báo WebSocket: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Lấy danh sách thông báo của user
     */
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Lấy danh sách thông báo chưa đọc
     */
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(
            userId, 
            Notification.NotificationStatus.unread
        );
    }

    /**
     * Đánh dấu thông báo là đã đọc
     */
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new IllegalArgumentException("Thông báo không tồn tại"));
        
        // Kiểm tra quyền: chỉ user sở hữu mới được đánh dấu đã đọc
        if (!notification.getUserId().equals(userId)) {
            throw new IllegalStateException("Bạn không có quyền truy cập thông báo này");
        }
        
        notification.setStatus(Notification.NotificationStatus.read);
        notificationRepository.save(notification);
    }

    /**
     * Đếm số thông báo chưa đọc
     */
    @Transactional(readOnly = true)
    public long countUnreadNotifications(Long userId) {
        return notificationRepository.countByUserIdAndStatus(
            userId, 
            Notification.NotificationStatus.unread
        );
    }
}

