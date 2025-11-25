package com.eventqr.repository;

import com.eventqr.model.CheckInHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CheckinRepository extends JpaRepository<CheckInHistory, Long> {

    boolean existsByTicket_TicketId(Long ticketId);

    /**
     * Kiểm tra user đã check-in vào sự kiện chưa
     */
    @Query("SELECT COUNT(c) > 0 FROM CheckInHistory c WHERE c.eventId = :eventId AND c.userId = :userId")
    boolean existsByEventIdAndUserId(@Param("eventId") Long eventId, @Param("userId") Long userId);
    
    /**
     * Đếm số check-in của một sự kiện
     */
    @Query("SELECT COUNT(c) FROM CheckInHistory c WHERE c.eventId = :eventId")
    int countByEventId(@Param("eventId") Long eventId);
}

