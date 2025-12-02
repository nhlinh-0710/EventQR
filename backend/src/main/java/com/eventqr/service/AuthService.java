package com.eventqr.service;

import com.eventqr.model.Account;
import com.eventqr.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AccountRepository accountRepo;

    // LINH
    public boolean register(Account account) {
        if (accountRepo.findByEmail(account.getEmail()).isPresent()) {
            return false; // Email đã tồn tại
        }

        account.setIs_active(true);
        // Set role based on what user selected during registration
        // Default to 'user' if no role specified
        if (account.getRole() == null || account.getRole().isEmpty()) {
            account.setRole("user");
        }
        
        // Debug log to see what role is being set
        logger.info("Registering user with role: {}", account.getRole());
        
        account.setCreated_at(new Timestamp(System.currentTimeMillis()));

        accountRepo.save(account);
        return true;
    }

    public Optional<Account> login(String email, String password) {
        return accountRepo.findByEmail(email)
                .filter(u -> u.getPassword().equals(password));
    }
    // LINH
}
