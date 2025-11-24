package com.eventqr.repository;

import com.eventqr.model.CheckInHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckinRepository extends JpaRepository<CheckInHistory, Long> {

    boolean existsByTicket_TicketId(Long ticketId);
}

