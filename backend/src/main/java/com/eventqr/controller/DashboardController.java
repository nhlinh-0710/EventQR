package com.eventqr.controller;

import com.eventqr.dto.DashboardStatsDTO;
import com.eventqr.model.Event;
import com.eventqr.repository.CheckinRepository;
import com.eventqr.repository.EventRepository;
import com.eventqr.repository.EventTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventTicketRepository ticketRepository;
    
    @Autowired
    private CheckinRepository checkinRepository;
    
    /**
     * GET /api/dashboard/statistics
     * Lấy thống kê tổng quan cho dashboard
     */
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
                totalAttendees = countAttendeesByOrganizer(organizerId);
            } else {
                // Thống kê tổng toàn hệ thống
                activeEvents = countActiveEvents();
                totalTicketsSold = ticketRepository.count();
                totalAttendees = checkinRepository.count();
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
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
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
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ===== HELPER METHODS =====
    
    /**
     * Đếm số sự kiện hoạt động (status = "active" hoặc đang trong thời gian diễn ra)
     */
    private long countActiveEvents() {
        LocalDateTime now = LocalDateTime.now();
        List<Event> allEvents = eventRepository.findAll();
        
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
        
        return organizerEvents.stream()
            .filter(event -> isEventActive(event, now))
            .count();
    }
    
    /**
     * Kiểm tra sự kiện có đang hoạt động không
     */
    private boolean isEventActive(Event event, LocalDateTime now) {
        // Sự kiện hoạt động nếu:
        // 1. Status = "active" hoặc
        // 2. Thời gian bắt đầu trong tương lai (upcoming) hoặc
        // 3. Đang trong thời gian diễn ra (ongoing)
        
        if ("active".equalsIgnoreCase(event.getStatus())) {
            return true;
        }
        
        LocalDateTime startTime = event.getStartTime();
        LocalDateTime endTime = event.getEndTime();
        
        if (startTime != null && endTime != null) {
            // Upcoming hoặc Ongoing
            return now.isBefore(endTime);
        }
        
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
     * Đếm số người đã check-in vào các sự kiện của organizer
     */
    private long countAttendeesByOrganizer(Long organizerId) {
        List<Event> organizerEvents = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        
        return organizerEvents.stream()
            .mapToLong(event -> checkinRepository.findByEventId(event.getEventId()).size())
            .sum();
    }
}

