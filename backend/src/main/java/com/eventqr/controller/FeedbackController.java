package com.eventqr.controller;

import com.eventqr.dto.CompletedEventResponse;
import com.eventqr.dto.FeedbackRequest;
import com.eventqr.dto.FeedbackReplyRequest;
import com.eventqr.dto.FeedbackResponse;
import com.eventqr.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * GET /api/feedback/completed-events/{userId}
     * Lấy danh sách sự kiện đã kết thúc mà user đã tham gia
     */
    @GetMapping("/completed-events/{userId}")
    public ResponseEntity<?> getCompletedEvents(@PathVariable Long userId) {
        try {
            List<CompletedEventResponse> events = feedbackService.getCompletedEventsForUser(userId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }

    /**
     * POST /api/feedback
     * Submit feedback cho sự kiện (endpoint legacy - giữ lại để backward compatibility)
     */
    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest request) {
        try {
            FeedbackResponse response = feedbackService.submitFeedback(request);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cảm ơn bạn đã đánh giá!",
                "feedback", response
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("success", false, "message", "Lỗi server: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/feedback/event/{eventId}
     * Lấy tất cả feedback của một sự kiện
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getFeedbacksByEvent(@PathVariable Long eventId) {
        try {
            List<FeedbackResponse> feedbacks = feedbackService.getFeedbacksByEventId(eventId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }

    /**
     * GET /api/feedback/user/{userId}
     * Lấy tất cả feedback của một user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFeedbacksByUser(@PathVariable Long userId) {
        try {
            List<FeedbackResponse> feedbacks = feedbackService.getFeedbacksByUserId(userId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }

    /**
     * GET /api/feedback/organizer/{organizerId}
     * Lấy tất cả feedback của các sự kiện thuộc về một organizer (format FeedbackResponse - legacy)
     */
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<?> getFeedbacksByOrganizer(@PathVariable("organizerId") Long organizerId) {
        try {
            System.out.println("🔍 [FeedbackController] Nhận request cho organizer: " + organizerId);
            List<FeedbackResponse> feedbacks = feedbackService.getFeedbacksByOrganizerId(organizerId);
            System.out.println("✅ [FeedbackController] Trả về " + feedbacks.size() + " feedback");
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            System.err.println("❌ [FeedbackController] Lỗi: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    /**
     * POST /api/feedback/{feedbackId}/reply
     * Organizer reply feedback
     */
    @PostMapping("/{feedbackId}/reply")
    public ResponseEntity<?> replyFeedback(
            @PathVariable Long feedbackId,
            @RequestBody FeedbackReplyRequest request) {
        try {
            if (request.getOrganizerId() == null) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Thiếu thông tin organizerId")
                );
            }
            
            FeedbackResponse response = feedbackService.replyFeedback(
                feedbackId, 
                request.getOrganizerId(), 
                request.getReply()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã gửi phản hồi thành công!",
                "feedback", response
            ));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("success", false, "message", "Lỗi server: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/feedback/test
     * Endpoint test để kiểm tra controller có hoạt động không
     */
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("success", true, "message", "FeedbackController is working!"));
    }
}

