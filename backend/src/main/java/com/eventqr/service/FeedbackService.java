package com.eventqr.service;

import com.eventqr.dto.CompletedEventResponse;
import com.eventqr.dto.FeedbackRequest;
import com.eventqr.dto.FeedbackResponse;
import com.eventqr.model.Event;
import com.eventqr.model.EventTicket;
import com.eventqr.model.Feedback;
import com.eventqr.repository.EventRepository;
import com.eventqr.repository.EventTicketRepository;
import com.eventqr.repository.FeedbackRepository;
import com.eventqr.repository.AccountRepository;
import com.eventqr.model.Account;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackService.class);

    private final FeedbackRepository feedbackRepository;
    private final EventRepository eventRepository;
    private final EventTicketRepository eventTicketRepository;
    private final AccountRepository accountRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                          EventRepository eventRepository,
                          EventTicketRepository eventTicketRepository,
                          AccountRepository accountRepository) {
        this.feedbackRepository = feedbackRepository;
        this.eventRepository = eventRepository;
        this.eventTicketRepository = eventTicketRepository;
        this.accountRepository = accountRepository;
    }

    /**
     * Lấy danh sách sự kiện đã kết thúc mà user đã tham gia (có ticket)
     * Chỉ trả về sự kiện có status = COMPLETED hoặc endTime < now
     */
    @Transactional(readOnly = true)
    public List<CompletedEventResponse> getCompletedEventsForUser(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        logger.info("🔍 Lấy danh sách sự kiện đã kết thúc cho user: {}", userId);
        
        // Lấy tất cả tickets của user (chưa bị hủy)
        List<EventTicket> tickets = eventTicketRepository.findByUserId(userId)
            .stream()
            .filter(t -> !t.getCancelled())
            .collect(Collectors.toList());

        logger.info("📋 Số lượng tickets của user (chưa hủy): {}", tickets.size());

        if (tickets.isEmpty()) {
            logger.warn("⚠️ User {} không có ticket nào", userId);
            return new ArrayList<>();
        }

        // Lấy eventIds từ tickets
        List<Long> eventIds = tickets.stream()
            .map(EventTicket::getEventId)
            .distinct()
            .collect(Collectors.toList());

        logger.info("🎫 Event IDs từ tickets: {}", eventIds);

        // Lấy events
        List<Event> events = eventRepository.findAllById(eventIds);
        logger.info("📅 Số lượng events tìm thấy: {}", events.size());

        // Lấy danh sách eventId mà user đã feedback
        Set<Long> feedbackedEventIds = feedbackRepository.findEventIdsByUserId(userId)
            .stream()
            .collect(Collectors.toSet());

        logger.info("✅ Event IDs đã feedback: {}", feedbackedEventIds);

        // Filter: chỉ lấy sự kiện đã kết thúc
        List<CompletedEventResponse> result = new ArrayList<>();
        
        for (Event event : events) {
            String eventStatus = event.getStatus();
            LocalDateTime endTime = event.getEndTime();
            
            logger.debug("🔎 Kiểm tra event {}: status={}, endTime={}, now={}", 
                event.getEventId(), eventStatus, endTime, now);
            
            // Kiểm tra sự kiện đã kết thúc chưa
            // Ưu tiên kiểm tra endTime trước (quan trọng hơn status)
            boolean isCompleted = false;
            
            // Kiểm tra endTime trước (nếu endTime đã qua thì coi như đã kết thúc)
            if (endTime != null && endTime.isBefore(now)) {
                isCompleted = true;
                logger.debug("✅ Event {} đã kết thúc (theo endTime: {} < {})", event.getEventId(), endTime, now);
            }
            
            // Hoặc kiểm tra status: COMPLETED hoặc "Đã kết thúc" (tiếng Việt)
            if (!isCompleted && eventStatus != null) {
                String upperStatus = eventStatus.toUpperCase().trim();
                if ("COMPLETED".equals(upperStatus) || "ĐÃ KẾT THÚC".equals(upperStatus)) {
                    isCompleted = true;
                    logger.debug("✅ Event {} đã kết thúc (theo status: {})", event.getEventId(), eventStatus);
                }
            }
            
            if (isCompleted) {
                // Tìm ticket tương ứng
                EventTicket ticket = tickets.stream()
                    .filter(t -> t.getEventId().equals(event.getEventId()))
                    .findFirst()
                    .orElse(null);
                
                if (ticket != null) {
                    boolean hasFeedback = feedbackedEventIds.contains(event.getEventId());
                    
                    logger.info("✅ Thêm event {} vào danh sách (hasFeedback: {})", event.getEventId(), hasFeedback);
                    
                    CompletedEventResponse response = new CompletedEventResponse(
                        event.getEventId(),
                        event.getTitle(),
                        event.getLocation(),
                        event.getImageUrl(),
                        event.getStartTime(),
                        event.getEndTime(),
                        event.getStatus(),
                        ticket.getTicketId(),
                        ticket.getRegisteredAt(),
                        hasFeedback
                    );
                    
                    result.add(response);
                } else {
                    logger.warn("⚠️ Không tìm thấy ticket cho event {}", event.getEventId());
                }
            } else {
                logger.debug("⏳ Event {} chưa kết thúc (status: {}, endTime: {})", 
                    event.getEventId(), eventStatus, endTime);
            }
        }

        // Sắp xếp theo endTime mới nhất trước
        result.sort((a, b) -> {
            if (a.getEndTime() == null) return 1;
            if (b.getEndTime() == null) return -1;
            return b.getEndTime().compareTo(a.getEndTime());
        });

        logger.info("📊 Trả về {} sự kiện đã kết thúc cho user {}", result.size(), userId);
        return result;
    }

    /**
     * Submit feedback
     * Logic: 
     * - Chỉ cho phép feedback sự kiện đã kết thúc
     * - User phải đã đăng ký sự kiện (có ticket)
     * - Mỗi user chỉ feedback 1 lần cho mỗi sự kiện
     */
    @Transactional
    public FeedbackResponse submitFeedback(FeedbackRequest request) {
        // Validate
        if (request.getEventId() == null || request.getUserId() == null) {
            throw new IllegalArgumentException("EventId và UserId không được để trống");
        }

        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating phải từ 1 đến 5");
        }

        // Kiểm tra user đã feedback chưa
        if (feedbackRepository.existsByEventIdAndUserId(request.getEventId(), request.getUserId())) {
            throw new IllegalStateException("Bạn đã đánh giá sự kiện này rồi!");
        }

        // Kiểm tra user có ticket không
        boolean hasTicket = eventTicketRepository.existsByEventIdAndUserId(
            request.getEventId(), 
            request.getUserId()
        );
        
        if (!hasTicket) {
            throw new IllegalStateException("Bạn chưa tham gia sự kiện này!");
        }

        // Kiểm tra sự kiện đã kết thúc chưa
        Event event = eventRepository.findById(request.getEventId())
            .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));

        LocalDateTime now = LocalDateTime.now();
        boolean isCompleted = false;
        String eventStatus = event.getStatus();

        // Ưu tiên kiểm tra endTime trước (nếu endTime đã qua thì coi như đã kết thúc)
        if (event.getEndTime() != null && event.getEndTime().isBefore(now)) {
            isCompleted = true;
        }
        
        // Hoặc kiểm tra status: COMPLETED hoặc "Đã kết thúc" (tiếng Việt)
        if (!isCompleted && eventStatus != null) {
            String upperStatus = eventStatus.toUpperCase().trim();
            if ("COMPLETED".equals(upperStatus) || "ĐÃ KẾT THÚC".equals(upperStatus)) {
                isCompleted = true;
            }
        }

        if (!isCompleted) {
            throw new IllegalStateException(
                String.format("Chỉ có thể đánh giá sự kiện đã kết thúc! (Status: %s, EndTime: %s)", 
                    eventStatus, event.getEndTime())
            );
        }

        // Tạo feedback
        Feedback feedback = new Feedback();
        feedback.setEventId(request.getEventId());
        feedback.setUserId(request.getUserId());
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setCreatedAt(LocalDateTime.now());

        Feedback saved = feedbackRepository.save(feedback);

        // Tạo response
        FeedbackResponse response = new FeedbackResponse();
        response.setFeedbackId(saved.getFeedbackId());
        response.setEventId(saved.getEventId());
        response.setEventTitle(event.getTitle());
        response.setUserId(saved.getUserId());
        response.setRating(saved.getRating());
        response.setComment(saved.getComment());
        response.setOrganizerReply(saved.getOrganizerReply());
        response.setOrganizerReplyAt(saved.getOrganizerReplyAt());
        response.setCreatedAt(saved.getCreatedAt());

        return response;
    }

    /**
     * Lấy feedback của một sự kiện
     */
    @Transactional(readOnly = true)
    public List<FeedbackResponse> getFeedbacksByEventId(Long eventId) {
        List<Feedback> feedbacks = feedbackRepository.findByEventIdOrderByCreatedAtDesc(eventId);
        Event event = eventRepository.findById(eventId).orElse(null);

        return feedbacks.stream().map(f -> {
            Account user = accountRepository.findById(f.getUserId()).orElse(null);
            FeedbackResponse response = new FeedbackResponse();
            response.setFeedbackId(f.getFeedbackId());
            response.setEventId(f.getEventId());
            response.setEventTitle(event != null ? event.getTitle() : null);
            response.setUserId(f.getUserId());
            response.setUserName(user != null ? user.getName() : "Khách ẩn danh");
            response.setRating(f.getRating());
            response.setComment(f.getComment());
            response.setOrganizerReply(f.getOrganizerReply());
            response.setOrganizerReplyAt(f.getOrganizerReplyAt());
            response.setCreatedAt(f.getCreatedAt());
            return response;
        }).collect(Collectors.toList());
    }

    /**
     * Lấy feedback của một user
     */
    @Transactional(readOnly = true)
    public List<FeedbackResponse> getFeedbacksByUserId(Long userId) {
        List<Feedback> feedbacks = feedbackRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return feedbacks.stream().map(f -> {
            Event event = eventRepository.findById(f.getEventId()).orElse(null);
            Account user = accountRepository.findById(f.getUserId()).orElse(null);
            FeedbackResponse response = new FeedbackResponse();
            response.setFeedbackId(f.getFeedbackId());
            response.setEventId(f.getEventId());
            response.setEventTitle(event != null ? event.getTitle() : null);
            response.setUserId(f.getUserId());
            response.setUserName(user != null ? user.getName() : "Khách ẩn danh");
            response.setRating(f.getRating());
            response.setComment(f.getComment());
            response.setOrganizerReply(f.getOrganizerReply());
            response.setOrganizerReplyAt(f.getOrganizerReplyAt());
            response.setCreatedAt(f.getCreatedAt());
            return response;
        }).collect(Collectors.toList());
    }

    /**
     * Lấy tất cả feedback của các sự kiện thuộc về một organizer
     */
    @Transactional(readOnly = true)
    public List<FeedbackResponse> getFeedbacksByOrganizerId(Long organizerId) {
        logger.info("🔍 Lấy danh sách feedback cho organizer: {}", organizerId);
        
        // Kiểm tra xem có sự kiện nào của organizer không
        List<Event> organizerEvents = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        logger.info("📅 Số lượng sự kiện của organizer {}: {}", organizerId, organizerEvents.size());
        
        if (organizerEvents.isEmpty()) {
            logger.warn("⚠️ Organizer {} không có sự kiện nào", organizerId);
            return new ArrayList<>();
        }
        
        List<Long> eventIds = organizerEvents.stream()
            .map(Event::getEventId)
            .collect(Collectors.toList());
        logger.info("🎫 Event IDs của organizer: {}", eventIds);
        
        // Thử query JOIN trước
        List<Feedback> feedbacks = feedbackRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        logger.info("📋 Số lượng feedback tìm thấy (từ query JOIN): {}", feedbacks.size());
        
        // Nếu query JOIN không trả về kết quả, thử query theo eventIds
        if (feedbacks.isEmpty() && !eventIds.isEmpty()) {
            logger.info("🔄 Query JOIN không trả về kết quả, thử query theo eventIds...");
            feedbacks = feedbackRepository.findByEventIdInOrderByCreatedAtDesc(eventIds);
            logger.info("📋 Số lượng feedback tìm thấy (từ query eventIds): {}", feedbacks.size());
        }
        
        if (feedbacks.isEmpty()) {
            logger.warn("⚠️ Không tìm thấy feedback nào cho organizer {}", organizerId);
            // Kiểm tra xem có feedback nào trong database không
            long totalFeedbacks = feedbackRepository.count();
            logger.info("📊 Tổng số feedback trong database: {}", totalFeedbacks);
            
            // Debug: kiểm tra feedback có event_id nào
            if (totalFeedbacks > 0) {
                List<Feedback> allFeedbacks = feedbackRepository.findAll();
                logger.info("🔍 Tất cả feedback trong DB:");
                allFeedbacks.forEach(f -> {
                    logger.info("   - Feedback ID: {}, Event ID: {}, User ID: {}, Rating: {}", 
                        f.getFeedbackId(), f.getEventId(), f.getUserId(), f.getRating());
                });
            }
        }

        return feedbacks.stream().map(f -> {
            Event event = eventRepository.findById(f.getEventId()).orElse(null);
            Account user = accountRepository.findById(f.getUserId()).orElse(null);
            
            FeedbackResponse response = new FeedbackResponse();
            response.setFeedbackId(f.getFeedbackId());
            response.setEventId(f.getEventId());
            response.setEventTitle(event != null ? event.getTitle() : null);
            response.setUserId(f.getUserId());
            response.setUserName(user != null ? user.getName() : "Khách ẩn danh");
            response.setRating(f.getRating());
            response.setComment(f.getComment());
            response.setOrganizerReply(f.getOrganizerReply());
            response.setOrganizerReplyAt(f.getOrganizerReplyAt());
            response.setCreatedAt(f.getCreatedAt());
            return response;
        }).collect(Collectors.toList());
    }

    /**
     * Organizer reply feedback
     * Kiểm tra organizer có quyền reply (phải là chủ sở hữu sự kiện)
     */
    @Transactional
    public FeedbackResponse replyFeedback(Long feedbackId, Long organizerId, String reply) {
        logger.info("💬 Organizer {} đang reply feedback {}", organizerId, feedbackId);
        
        // Lấy feedback
        Feedback feedback = feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new IllegalArgumentException("Feedback không tồn tại"));
        
        // Lấy event
        Event event = eventRepository.findById(feedback.getEventId())
            .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));
        
        // Kiểm tra quyền: organizer phải là chủ sở hữu sự kiện
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new IllegalStateException("Bạn không có quyền reply feedback này!");
        }
        
        // Validate reply
        if (reply == null || reply.trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung reply không được để trống");
        }
        
        // Cập nhật reply
        feedback.setOrganizerReply(reply.trim());
        feedback.setOrganizerReplyAt(LocalDateTime.now());
        
        Feedback saved = feedbackRepository.save(feedback);
        
        // Tạo response
        Account user = accountRepository.findById(saved.getUserId()).orElse(null);
        FeedbackResponse response = new FeedbackResponse();
        response.setFeedbackId(saved.getFeedbackId());
        response.setEventId(saved.getEventId());
        response.setEventTitle(event.getTitle());
        response.setUserId(saved.getUserId());
        response.setUserName(user != null ? user.getName() : "Khách ẩn danh");
        response.setRating(saved.getRating());
        response.setComment(saved.getComment());
        response.setOrganizerReply(saved.getOrganizerReply());
        response.setOrganizerReplyAt(saved.getOrganizerReplyAt());
        response.setCreatedAt(saved.getCreatedAt());
        
        logger.info("✅ Đã reply feedback thành công");
        return response;
    }
}

