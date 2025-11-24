package com.eventqr.dto;

import com.eventqr.model.Event;
import com.eventqr.model.EventTicket;
import com.eventqr.model.Account;

public class CheckinResponse {

    private Event event;
    private EventTicket ticket;
    private Account user;

    public CheckinResponse(Event event, EventTicket ticket, Account user) {
        this.event = event;
        this.ticket = ticket;
        this.user = user;
    }

    public Event getEvent() { return event; }
    public EventTicket getTicket() { return ticket; }
    public Account getUser() { return user; }
}
