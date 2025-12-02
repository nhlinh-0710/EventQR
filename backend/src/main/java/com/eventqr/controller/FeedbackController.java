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
import com.eventqr.repository.FeedbackRepository;
import com.eventqr.model.Feedback;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;


@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;

     @Autowired
    private FeedbackRepository feedbackRepository;

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
    // LINH
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
    // LINH

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
    // LINH
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
    // LINH

    /**
     * GET /api/feedback/test
     * Endpoint test để kiểm tra controller có hoạt động không
     */
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("success", true, "message", "FeedbackController is working!"));
    }

        /**
     * GET /api/feedback/admin/event/{eventId}/export-pdf
     * Admin export toàn bộ feedback của một event ra file PDF
     */
    @GetMapping("/admin/event/{eventId}/export-pdf")
    public ResponseEntity<byte[]> exportFeedbacksPdf(@PathVariable Long eventId) {
        try {
            // Lấy danh sách feedback theo eventId (entity gốc)
            java.util.List<Feedback> feedbacks =
                    feedbackRepository.findByEventIdOrderByCreatedAtDesc(eventId);

            // Tạo PDF
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);

            document.open();

            // Tiêu đề
            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Paragraph title = new Paragraph("BÁO CÁO FEEDBACK SỰ KIỆN #" + eventId, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20f);
            document.add(title);

            if (feedbacks.isEmpty()) {
                document.add(new Paragraph("Không có feedback nào cho sự kiện này."));
            } else {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

                // Bảng: Thời gian - UserId - Rating - Nội dung
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setSpacingBefore(10f);
                table.setSpacingAfter(10f);
                table.setWidths(new float[]{2.5f, 1.5f, 1.0f, 5.0f});

                Font headerFont = new Font(Font.HELVETICA, 11, Font.BOLD);
                table.addCell(new Phrase("Thời gian", headerFont));
                table.addCell(new Phrase("User ID", headerFont));
                table.addCell(new Phrase("Điểm", headerFont));
                table.addCell(new Phrase("Nội dung", headerFont));

                Font cellFont = new Font(Font.HELVETICA, 10);

                for (Feedback f : feedbacks) {
                    String time = f.getCreatedAt() != null
                            ? f.getCreatedAt().format(formatter)
                            : "";

                    table.addCell(new Phrase(time, cellFont));
                    table.addCell(new Phrase(
                            f.getUserId() != null ? String.valueOf(f.getUserId()) : "",
                            cellFont
                    ));
                    // các field này giả định trong entity Feedback có getter tương ứng
                    table.addCell(new Phrase(
                            f.getRating() != null ? String.valueOf(f.getRating()) : "",
                            cellFont
                    ));
                    table.addCell(new Phrase(
                            f.getComment() != null ? f.getComment() : "",
                            cellFont
                    ));
                }

                document.add(table);
            }

            document.close();

            byte[] pdfBytes = baos.toByteArray();

            // Header HTTP để trình duyệt tải file
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData(
                    "attachment",
                    "feedback_event_" + eventId + ".pdf"
            );
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

}

