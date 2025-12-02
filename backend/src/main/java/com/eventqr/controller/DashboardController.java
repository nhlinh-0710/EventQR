package com.eventqr.controller;

import com.eventqr.dto.DashboardStatsDTO;
import com.eventqr.model.Event;
import com.eventqr.repository.EventRepository;
import com.eventqr.repository.EventTicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventTicketRepository ticketRepository;
    
    /**
     * GET /api/dashboard/statistics
     * Lấy thống kê tổng quan cho dashboard
     */
    // LINH
    @GetMapping("/statistics")
    public ResponseEntity<DashboardStatsDTO> getDashboardStatistics(
            @RequestParam(required = false) Long organizerId) {
        
        try {
            long activeEvents;
            long totalTicketsSold;
            long totalAttendees;
            
            if (organizerId != null) {
                // Thống kê cho một organizer cụ thể
                activeEvents = countActiveEventsByOrganizer(organizerId);
                totalTicketsSold = countTicketsByOrganizer(organizerId);
                // Số người tham dự = số người đăng ký (tickets), không phải check-in
                totalAttendees = totalTicketsSold;
            } else {
                // Thống kê tổng toàn hệ thống
                activeEvents = countActiveEvents();
                totalTicketsSold = ticketRepository.count();
                // Số người tham dự = số người đăng ký (tickets), không phải check-in
                totalAttendees = totalTicketsSold;
            }
            
            // Tính doanh thu mẫu (100,000 VND/vé)
            // Trong thực tế, cần có field price trong EventTicket
            long totalRevenue = totalTicketsSold * 100000;
            
            DashboardStatsDTO stats = new DashboardStatsDTO(
                activeEvents,
                totalAttendees,
                totalTicketsSold,
                totalRevenue
            );
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            logger.error("❌ Lỗi khi lấy thống kê dashboard: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    // LINH
    
    /**
     * GET /api/dashboard/recent-events
     * Lấy danh sách sự kiện gần đây (sắp diễn ra hoặc đang diễn ra)
     */
    @GetMapping("/recent-events")
    public ResponseEntity<List<Event>> getRecentEvents(
            @RequestParam(required = false) Long organizerId,
            @RequestParam(defaultValue = "5") int limit) {
        
        try {
            List<Event> events;
            
            if (organizerId != null) {
                // Lấy sự kiện của organizer cụ thể
                events = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
            } else {
                // Lấy tất cả sự kiện
                events = eventRepository.findAll();
            }
            
            // Cập nhật status động cho tất cả events
            LocalDateTime now = LocalDateTime.now();
            events.forEach(event -> updateEventStatus(event, now));
            
            // Lọc và sắp xếp theo thời gian bắt đầu
            List<Event> recentEvents = events.stream()
                .sorted((e1, e2) -> {
                    if (e1.getStartTime() == null) return 1;
                    if (e2.getStartTime() == null) return -1;
                    return e1.getStartTime().compareTo(e2.getStartTime());
                })
                .limit(limit)
                .toList();
            
            return ResponseEntity.ok(recentEvents);
            
        } catch (Exception e) {
            logger.error("❌ Lỗi khi lấy recent events: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ===== HELPER METHODS =====
    
    /**
     * Đếm số sự kiện hoạt động (UPCOMING hoặc ONGOING)
     */
    private long countActiveEvents() {
        LocalDateTime now = LocalDateTime.now();
        List<Event> allEvents = eventRepository.findAll();
        
        // Cập nhật status động cho tất cả events
        allEvents.forEach(event -> updateEventStatus(event, now));
        
        return allEvents.stream()
            .filter(event -> isEventActive(event, now))
            .count();
    }
    
    /**
     * Đếm số sự kiện hoạt động của một organizer
     */
    private long countActiveEventsByOrganizer(Long organizerId) {
        LocalDateTime now = LocalDateTime.now();
        List<Event> organizerEvents = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        
        // Cập nhật status động cho tất cả events
        organizerEvents.forEach(event -> updateEventStatus(event, now));
        
        return organizerEvents.stream()
            .filter(event -> isEventActive(event, now))
            .count();
    }
    
    /**
     * Kiểm tra sự kiện có đang hoạt động không
     * Sự kiện hoạt động = UPCOMING (sắp diễn ra) hoặc ONGOING (đang diễn ra)
     * KHÔNG bao gồm COMPLETED (đã kết thúc)
     */
    private boolean isEventActive(Event event, LocalDateTime now) {
        String status = event.getStatus();
        
        if (status == null) {
            return false;
        }
        
        // Kiểm tra status: chỉ UPCOMING hoặc ONGOING là active
        status = status.toUpperCase();
        if ("UPCOMING".equals(status) || "ONGOING".equals(status)) {
            return true;
        }
        
        // Nếu status là COMPLETED hoặc khác, không phải active
        return false;
    }
    
    /**
     * Đếm số vé đã bán của các sự kiện thuộc organizer
     */
    private long countTicketsByOrganizer(Long organizerId) {
        List<Event> organizerEvents = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        
        return organizerEvents.stream()
            .mapToLong(event -> ticketRepository.findByEventId(event.getEventId()).size())
            .sum();
    }
    
    /**
     * Cập nhật status của event dựa trên thời gian hiện tại
     * KHÔNG lưu vào database, chỉ update object trong memory
     * 
     * LƯU Ý: Không override status nếu là CANCELLED hoặc DRAFT (do người dùng set thủ công)
     */
    private void updateEventStatus(Event event, LocalDateTime now) {
        String currentStatus = event.getStatus();
        
        // Nếu status là CANCELLED hoặc DRAFT, giữ nguyên (người dùng set thủ công)
        if (currentStatus != null) {
            String upperStatus = currentStatus.toUpperCase();
            if ("CANCELLED".equals(upperStatus) || "DRAFT".equals(upperStatus)) {
                return; // Không tự động override
            }
        }
        
        LocalDateTime startTime = event.getStartTime();
        LocalDateTime endTime = event.getEndTime();
        
        // Nếu không có thời gian, set DRAFT
        if (startTime == null || endTime == null) {
            event.setStatus("DRAFT");
            return;
        }
        
        // Xác định status tự động dựa trên thời gian
        if (now.isBefore(startTime)) {
            // Chưa bắt đầu
            event.setStatus("UPCOMING");
        } else if (now.isAfter(endTime)) {
            // Đã kết thúc
            event.setStatus("COMPLETED");
        } else {
            // Đang diễn ra
            event.setStatus("ONGOING");
        }
    }
}

