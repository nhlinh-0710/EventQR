package com.eventqr.controller;

import com.eventqr.dto.CheckinResponse;
import com.eventqr.dto.QrCheckinPayload;
import com.eventqr.model.Account;
import com.eventqr.model.CheckInHistory;
import com.eventqr.model.Event;
import com.eventqr.model.EventTicket;
import com.eventqr.repository.AccountRepository;
import com.eventqr.repository.CheckinRepository;
import com.eventqr.repository.EventRepository;
import com.eventqr.repository.EventTicketRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CheckInController {

    private final EventTicketRepository ticketRepo;
    private final EventRepository eventRepo;
    private final AccountRepository accountRepo;
    private final CheckinRepository checkRepo;
    private final ObjectMapper mapper;

    public CheckInController(
            EventTicketRepository ticketRepo,
            EventRepository eventRepo,
            AccountRepository accountRepo,
            CheckinRepository checkRepo,
            ObjectMapper mapper
    ) {
        this.ticketRepo = ticketRepo;
        this.eventRepo = eventRepo;
        this.accountRepo = accountRepo;
        this.checkRepo = checkRepo;
        this.mapper = mapper;
    }

    @GetMapping("/checkin")
    public ResponseEntity<?> checkIn(@RequestParam("payload") String payloadBase64) {

        try {
            // 1. Decode Base64 → JSON
            String json = new String(Base64.getDecoder().decode(payloadBase64), StandardCharsets.UTF_8);

            // 2. Parse thành DTO
            QrCheckinPayload payload = mapper.readValue(json, QrCheckinPayload.class);

            // 3. Lấy vé
            EventTicket ticket = ticketRepo.findById(payload.getTicketId())
                    .orElseThrow(() -> new IllegalArgumentException("Vé không tồn tại!"));

            // 4. Lấy sự kiện
            Event event = eventRepo.findById(payload.getEventId())
                    .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại!"));

            // Vé phải thuộc sự kiện đó
            if (!ticket.getEventId().equals(event.getEventId())) {
                throw new IllegalArgumentException("Vé không thuộc sự kiện này!");
            }

            // 5. Lấy user
            Account user = accountRepo.findById(payload.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại!"));

            // 6. Không cho check-in lại
            if (checkRepo.existsByTicket_TicketId(ticket.getTicketId())) {
                throw new IllegalStateException("Vé này đã check-in trước đó!");
            }

            // 7. Lưu check-in
            CheckInHistory history = new CheckInHistory(ticket, payload.getUserId(), payload.getEventId());
            checkRepo.save(history);

            // 8. Trả respons cho FE
            return ResponseEntity.ok(new CheckinResponse(event, ticket, user));

        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(error(ex.getMessage()));

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().body(error("Lỗi hệ thống!"));
        }
    }

    private Map<String, Object> error(String msg) {
        Map<String, Object> m = new HashMap<>();
        m.put("success", false);
        m.put("message", msg);
        return m;
    }
    @GetMapping("/checkin-by-code")
public ResponseEntity<?> checkInByCode(@RequestParam("code") String code) {
    try {
        // Mã có dạng: #8-E5-U1
        String cleaned = code.replace("#", "").trim();   // => 8-E5-U1
        String[] parts = cleaned.split("-");

        if (parts.length != 3) {
            throw new IllegalArgumentException("Mã QR không hợp lệ!");
        }

        Long ticketId = Long.parseLong(parts[0]);       // 8
        Long eventId = Long.parseLong(parts[1].substring(1));  // E5 -> 5
        Long userId = Long.parseLong(parts[2].substring(1));   // U1 -> 1

        // Lấy ticket
        EventTicket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Vé không tồn tại!"));

        // Lấy event
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại!"));

        // Lấy user
        Account user = accountRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại!"));

        // Kiểm tra trùng event
        if (!ticket.getEventId().equals(event.getEventId())) {
            throw new IllegalArgumentException("Mã QR không đúng sự kiện!");
        }

        // Không cho check-in trùng
        if (checkRepo.existsByTicket_TicketId(ticketId)) {
            throw new IllegalStateException("Vé này đã check-in!");
        }

        // Lưu lịch sử
        CheckInHistory history = new CheckInHistory(ticket, userId, eventId);
        checkRepo.save(history);

        return ResponseEntity.ok(new CheckinResponse(event, ticket, user));

    } catch (Exception e) {
        return ResponseEntity.badRequest().body(error(e.getMessage()));
    }
}

}
