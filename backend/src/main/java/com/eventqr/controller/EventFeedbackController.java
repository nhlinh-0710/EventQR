package com.eventqr.controller;

import com.eventqr.dto.FeedbackRequest;
import com.eventqr.dto.FeedbackResponse;
import com.eventqr.service.FeedbackService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller cho các endpoint feedback của sự kiện
 * Base path: /api/event (singular)
 */
@RestController
@RequestMapping("/api/event")
@CrossOrigin(origins = "*")
public class EventFeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(EventFeedbackController.class);

    private final FeedbackService feedbackService;

    @Autowired
    public EventFeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * POST /api/event/{eventId}/feedback
     * Submit feedback cho sự kiện
     * Body: {"userId": 10, "rating": 5, "comment": "Sự kiện tổ chức rất tốt!"}
     * 
     * Logic API:
     * - Kiểm tra sự kiện có tồn tại
     * - Kiểm tra trạng thái sự kiện = "ENDED", nếu không → trả lỗi "Sự kiện chưa kết thúc, không thể đánh giá."
     * - Kiểm tra user có tham gia không (existsByEventIdAndUserId)
     * - Kiểm tra user đã đánh giá trước đó chưa
     * - Lưu đánh giá mới vào DB
     */
    // LINH
    @PostMapping("/{eventId}/feedback")
    public ResponseEntity<?> submitFeedbackForEvent(
            @PathVariable Long eventId,
            @RequestBody Map<String, Object> requestBody) {
        try {
            // Tạo FeedbackRequest từ requestBody
            FeedbackRequest request = new FeedbackRequest();
            request.setEventId(eventId);
            
            Object userIdObj = requestBody.get("userId");
            if (userIdObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("success", false, "message", "Thiếu thông tin userId")
                );
            }
            request.setUserId(Long.valueOf(userIdObj.toString()));
            
            Object ratingObj = requestBody.get("rating");
            if (ratingObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("success", false, "message", "Thiếu thông tin rating")
                );
            }
            request.setRating(Integer.valueOf(ratingObj.toString()));
            
            Object commentObj = requestBody.get("comment");
            if (commentObj != null) {
                request.setComment(commentObj.toString());
            }

            // Submit feedback (logic đầy đủ trong FeedbackService)
            FeedbackResponse response = feedbackService.submitFeedback(request);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cảm ơn bạn đã đánh giá!",
                "feedback", response
            ));
        } catch (IllegalArgumentException e) {
            // Lỗi 400: Bad Request (thiếu thông tin, dữ liệu không hợp lệ)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (IllegalStateException e) {
            // Lỗi 403: Forbidden (không có quyền, vi phạm business rule)
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (Exception e) {
            logger.error("❌ Lỗi khi tạo feedback: {}", e.getMessage(), e);
            // Lỗi 500: Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("success", false, "message", "Lỗi server: " + e.getMessage())
            );
        }
    }
    // LINH
}

