package com.eventqr.repository;

import com.eventqr.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Spring Data JPA cung cấp các hàm CRUD cơ bản
    
    // Tìm tất cả sự kiện của một organizer
    List<Event> findByOrganizerIdOrderByCreatedAtDesc(Long organizerId);
    
    // Kiểm tra sự kiện có thuộc về organizer không
    boolean existsByEventIdAndOrganizerId(Long eventId, Long organizerId);
}