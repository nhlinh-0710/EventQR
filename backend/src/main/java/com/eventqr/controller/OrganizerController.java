package com.eventqr.controller;

import com.eventqr.dto.OrganizerFeedbackResponse;
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

    @Autowired
    public OrganizerController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
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
}

