package com.eventqr.service;

import com.eventqr.dto.EventRegisterRequest;
import com.eventqr.dto.UserTicketResponse;
import com.eventqr.model.Event;
import com.eventqr.model.EventTicket;
import com.eventqr.repository.EventRepository;
import com.eventqr.repository.EventTicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class EventRegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(EventRegistrationService.class);

    private final EventTicketRepository eventTicketRepo;
    private final EventRepository eventRepo;
    private final NotificationService notificationService;

    public EventRegistrationService(EventTicketRepository eventTicketRepo, 
                                    EventRepository eventRepo,
                                    NotificationService notificationService) {
        this.eventTicketRepo = eventTicketRepo;
        this.eventRepo = eventRepo;
        this.notificationService = notificationService;
    }

    // ==========================
    // ĐĂNG KÝ SỰ KIỆN
    // ==========================
    // LINH
    @Transactional
    public EventTicket register(EventRegisterRequest req) {

        // Đã đăng ký rồi thì báo lỗi
        if (eventTicketRepo.existsByEventIdAndUserId(req.getEventId(), req.getUserId())) {
            throw new IllegalStateException("Bạn đã đăng ký sự kiện này rồi!");
        }

        // Kiểm tra sự kiện tồn tại và lấy thông tin
        Event event = eventRepo.findById(req.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));

        // Tạo đối tượng vé
        EventTicket ticket = new EventTicket();
        ticket.setEventId(req.getEventId());
        ticket.setUserId(req.getUserId());       
        ticket.setName(req.getName());
        ticket.setEmail(req.getEmail());
        ticket.setPhone(req.getPhone());
        ticket.setOccupation(req.getOccupation());
        ticket.setTicketType(req.getTicketType());
        ticket.setNote(req.getNote());

        EventTicket savedTicket = eventTicketRepo.save(ticket);

        // Gửi thông báo realtime tới organizer
        try {
            notificationService.sendToOrganizer(
                event.getOrganizerId(),  // ID của organizer
                event.getEventId(),      // ID của sự kiện
                event.getTitle(),        // Tên sự kiện
                req.getName()            // Tên user đăng ký
            );
        } catch (Exception e) {
            // Log lỗi nhưng không throw để không ảnh hưởng đến quá trình đăng ký
            logger.error("Lỗi khi gửi thông báo: {}", e.getMessage(), e);
        }

        return savedTicket;
    }
    // LINH

    // ==========================
    // LẤY DANH SÁCH VÉ CỦA USER
    // ==========================
    @Transactional(readOnly = true)
    public List<UserTicketResponse> getTicketsOfUser(Long userId) {

        // Lấy TẤT CẢ vé của user (bao gồm cả vé đã hủy)
        List<EventTicket> list = eventTicketRepo.findByUserId(userId);
        
        // Debug log
        logger.debug("📋 Found {} tickets for user {}", list.size(), userId);

        List<Long> eventIds = list.stream()
                .map(EventTicket::getEventId)
                .toList();

        Map<Long, Event> eventMap = eventRepo.findAllById(eventIds).stream()
                .collect(
                        HashMap::new,
                        (m, e) -> m.put(e.getEventId(), e),
                        HashMap::putAll
                );

        // Cập nhật status động cho tất cả events
        LocalDateTime now = LocalDateTime.now();
        eventMap.values().forEach(event -> updateEventStatus(event, now));

        List<UserTicketResponse> output = new ArrayList<>();

        for (EventTicket t : list) {
            Event e = eventMap.get(t.getEventId());
            if (e == null) continue;

            String eventStatus = e.getStatus();
            Boolean cancelled = t.getCancelled() != null ? t.getCancelled() : false;
            
            // Debug log
            logger.debug("📋 Creating UserTicketResponse: Ticket ID: {}, Event Status: {}, Ticket Cancelled: {}", 
                t.getTicketId(), eventStatus, cancelled);

            UserTicketResponse response = new UserTicketResponse(
                    t.getTicketId(),
                    e.getEventId(),
                    e.getTitle(),
                    e.getLocation(),
                    e.getImageUrl(),
                    e.getStartTime(),
                    e.getEndTime(),
                    t.getTicketType(),
                    t.getRegisteredAt(),
                    eventStatus, // Event status
                    cancelled // Ticket cancelled status
            );
            
            response.setPhone(t.getPhone());

            // Verify fields are set
            logger.debug("   - Response eventStatus: {}, cancelled: {}", 
                response.getEventStatus(), response.getCancelled());
            
            output.add(response);
        }

        return output;
    }

    // ==========================
    // HỦY VÉ
    // ==========================
    @Transactional
    public void cancelTicket(Long userId, Long ticketId) {

        EventTicket ticket = eventTicketRepo.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Vé không tồn tại"));

        // Kiểm tra quyền
        if (!ticket.getUserId().equals(userId)) {
            throw new IllegalStateException("Bạn không có quyền hủy vé này");
        }

        // (Optional) chặn hủy nếu sự kiện đã bắt đầu
        // Event event = eventRepo.findById(ticket.getEventId())
        //     .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));
        // if (event.getStartTime() != null && event.getStartTime().isBefore(LocalDateTime.now())) {
        //     throw new IllegalStateException("Sự kiện đã bắt đầu, không thể hủy vé");
        // }

        // Đánh dấu vé là đã hủy thay vì xóa
        ticket.setCancelled(true);
        eventTicketRepo.save(ticket);
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
