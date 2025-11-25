package com.eventqr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EventQrApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventQrApplication.class, args);
        System.out.println(" Server đang chạy tại http://localhost:8080");
    }
}
