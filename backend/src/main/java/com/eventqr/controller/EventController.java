package com.eventqr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import com.eventqr.dto.EventRequest;
import com.eventqr.model.Event;
import com.eventqr.service.EventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    // API: POST /api/events (Tạo Sự Kiện Mới)
    @PostMapping
    public ResponseEntity<?> createEvent(
            @ModelAttribute EventRequest eventRequest,
            @RequestHeader(value = "X-Organizer-Id", required = false) Long organizerIdHeader,
            @RequestParam(value = "organizerId", required = false) Long organizerIdParam) {
        try {
            if (eventRequest.getTitle() == null || eventRequest.getEventDate() == null || eventRequest.getLocation() == null) {
                 return new ResponseEntity<>("Vui lòng cung cấp đầy đủ thông tin bắt buộc.", HttpStatus.BAD_REQUEST);
            }
            
            // Lấy organizerId từ header, param, hoặc từ request body (ưu tiên header)
            Long organizerId = organizerIdHeader != null ? organizerIdHeader : 
                              (organizerIdParam != null ? organizerIdParam : eventRequest.getOrganizerId());
            
            if (organizerId == null) {
                return new ResponseEntity<>(
                    Map.of("success", false, "message", "Thiếu thông tin organizerId. Vui lòng đăng nhập lại."), 
                    HttpStatus.BAD_REQUEST
                );
            }
            
            // Gán organizerId vào request
            eventRequest.setOrganizerId(organizerId);
            
            Event createdEvent = eventService.createEvent(eventRequest);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                Map.of("success", false, "message", "Lỗi khi tạo sự kiện: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // API: PUT /api/events/{id} (Chỉnh Sửa Sự Kiện)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id, 
            @ModelAttribute EventRequest eventRequest,
            @RequestHeader(value = "X-Organizer-Id", required = false) Long organizerIdHeader,
            @RequestParam(value = "organizerId", required = false) Long organizerIdParam) {
        try {
            // Lấy organizerId từ header hoặc param (ưu tiên header)
            Long organizerId = organizerIdHeader != null ? organizerIdHeader : organizerIdParam;
            if (organizerId == null) {
                return new ResponseEntity<>("Thiếu thông tin organizerId", HttpStatus.BAD_REQUEST);
            }
            
            Event updatedEvent = eventService.updateEvent(id, eventRequest, organizerId);
            return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi cập nhật sự kiện: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // API: DELETE /api/events/{id} (Xóa Sự Kiện)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id,
            @RequestHeader(value = "X-Organizer-Id", required = false) Long organizerIdHeader,
            @RequestParam(value = "organizerId", required = false) Long organizerIdParam) {
        try {
            Long organizerId = organizerIdHeader != null ? organizerIdHeader : organizerIdParam;
            if (organizerId == null) {
                return new ResponseEntity<>("Thiếu thông tin organizerId", HttpStatus.BAD_REQUEST);
            }
            
            eventService.deleteEvent(id, organizerId);
            return new ResponseEntity<>(Map.of("success", true, "message", "Xóa sự kiện thành công"), HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi xóa sự kiện: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // API: GET /api/events/{id} (Lấy Chi Tiết Sự Kiện)
    // Nếu có organizerId, chỉ trả về nếu organizer là chủ sở hữu
    // Nếu không có organizerId, cho phép xem công khai (cho user tham dự)
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(
            @PathVariable Long id,
            @RequestHeader(value = "X-Organizer-Id", required = false) Long organizerIdHeader,
            @RequestParam(value = "organizerId", required = false) Long organizerIdParam) {
        try {
            Event event = eventService.getEventById(id);
            
            // Nếu có organizerId, kiểm tra quyền sở hữu
            Long organizerId = organizerIdHeader != null ? organizerIdHeader : organizerIdParam;
            if (organizerId != null) {
                // Nếu organizer yêu cầu xem, chỉ trả về nếu họ là chủ sở hữu
                if (!event.getOrganizerId().equals(organizerId)) {
                    return new ResponseEntity<>(
                        Map.of("success", false, "message", "Bạn không có quyền xem sự kiện này"), 
                        HttpStatus.FORBIDDEN
                    );
                }
            }
            
            return new ResponseEntity<>(event, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                Map.of("success", false, "message", e.getMessage()), 
                HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                Map.of("success", false, "message", "Lỗi khi lấy thông tin sự kiện: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // API: GET /api/events (Lấy Danh Sách TẤT CẢ Sự Kiện - cho user xem)
    @GetMapping 
    public ResponseEntity<List<Event>> getAllEvents() {
        try {
        List<Event> events = eventService.findAll(); 
        
        if (events.isEmpty()) {
            // ✅ SỬA ĐỔI: Thay vì NO_CONTENT (204), trả về MẢNG RỖNG (200 OK)
            // Điều này giúp Frontend nhận được mảng [] thay vì phản hồi rỗng
            return new ResponseEntity<>(events, HttpStatus.OK); 
        }
        // Trả về 200 OK cùng với danh sách sự kiện
        return new ResponseEntity<>(events, HttpStatus.OK);
    } catch (Exception e) {
        // Xử lý lỗi nếu có vấn đề về Database
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }
    
    // API: GET /api/events/my-events (Lấy Danh Sách Sự Kiện Của Organizer)
    @GetMapping("/my-events")
    public ResponseEntity<?> getMyEvents(
            @RequestHeader(value = "X-Organizer-Id", required = false) Long organizerIdHeader,
            @RequestParam(value = "organizerId", required = false) Long organizerIdParam) {
        try {
            // Lấy organizerId từ header hoặc param (ưu tiên header)
            Long organizerId = organizerIdHeader != null ? organizerIdHeader : organizerIdParam;
            if (organizerId == null) {
                return new ResponseEntity<>(
                    Map.of("success", false, "message", "Thiếu thông tin organizerId"), 
                    HttpStatus.BAD_REQUEST
                );
            }
            
            List<Event> events = eventService.findByOrganizerId(organizerId);
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                Map.of("success", false, "message", "Lỗi khi lấy danh sách sự kiện: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}