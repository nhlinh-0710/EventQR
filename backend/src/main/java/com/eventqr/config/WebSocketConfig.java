package com.eventqr.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker to carry messages back to the client
        // Prefix "/topic" for destinations where the server will send messages to clients
        config.enableSimpleBroker("/topic");
        // Prefix "/app" for messages that are bound to @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the "/ws" endpoint, enabling SockJS fallback options
        // This allows clients to connect to "/ws" and use any transport (websocket, xhr-streaming, etc.)
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*") // Allow all origins for development
                .withSockJS();
    }
}

