package com.eventqr.controller;

// import com.eventqr.dto.AttendeeResponse;
// import com.eventqr.dto.AttendeeStatistics;
import com.eventqr.dto.OrganizerFeedbackResponse;
// import com.eventqr.service.AttendeeService;
import com.eventqr.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller cho các endpoint của organizer
 * Base path: /api/organizer
 */
@RestController
@RequestMapping("/api/organizer")
@CrossOrigin(origins = "*")
public class OrganizerController {

    private final FeedbackService feedbackService;
    // private final AttendeeService attendeeService;

    @Autowired
    public OrganizerController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
        // this.attendeeService = attendeeService;
    }

    /**
     * GET /api/organizer/{id}/feedback
     * Lấy danh sách feedback của organizer
     * 
     * Trả về:
     * [
     *   {
     *     "eventId": 12,
     *     "eventName": "Tech Innovation 2025",
     *     "userName": "Nguyễn Văn A",
     *     "rating": 5,
     *     "comment": "Hay!",
     *     "time": "2025-11-20 14:22"
     *   }
     * ]
     */
    @GetMapping("/{id}/feedback")
    public ResponseEntity<?> getOrganizerFeedbacks(@PathVariable("id") Long organizerId) {
        try {
            List<OrganizerFeedbackResponse> feedbacks = feedbackService.getOrganizerFeedbacks(organizerId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // ========================================================================
    // ATTENDEES ENDPOINTS - DISABLED (Chức năng đã xóa khỏi frontend)
    // ========================================================================
    // Uncomment các endpoint dưới nếu muốn restore lại chức năng Người Tham Dự
    
    /*
    @GetMapping("/{organizerId}/events/{eventId}/attendees")
    public ResponseEntity<?> getEventAttendees(
            @PathVariable("organizerId") Long organizerId,
            @PathVariable("eventId") Long eventId) {
        try {
            List<AttendeeResponse> attendees = attendeeService.getAttendeesByEventId(eventId, organizerId);
            return ResponseEntity.ok(attendees);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("success", false, "message", "Lỗi hệ thống: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/{organizerId}/events/{eventId}/attendees/statistics")
    public ResponseEntity<?> getEventAttendeeStatistics(
            @PathVariable("organizerId") Long organizerId,
            @PathVariable("eventId") Long eventId) {
        try {
            AttendeeStatistics stats = attendeeService.getAttendeeStatistics(eventId, organizerId);
            return ResponseEntity.ok(stats);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("success", false, "message", "Lỗi hệ thống: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/{organizerId}/attendees/statistics")
    public ResponseEntity<?> getAllEventsAttendeeStatistics(@PathVariable("organizerId") Long organizerId) {
        try {
            AttendeeStatistics stats = attendeeService.getAllEventsStatistics(organizerId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("success", false, "message", "Lỗi hệ thống: " + e.getMessage())
            );
        }
    }
    */
}

