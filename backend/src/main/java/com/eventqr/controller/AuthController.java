package com.eventqr.controller;

import com.eventqr.model.Account;
import com.eventqr.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // LINH
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Account account) {
        Map<String, Object> response = new HashMap<>();

        boolean success = authService.register(account);
        if (success) {
            response.put("success", true);
            response.put("message", "Đăng ký thành công");
            response.put("account", account);
            response.put("role", account.getRole()); // Add role to response
        } else {
            response.put("success", false);
            response.put("message", "Email đã tồn tại");
        }

        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Account account) {
        Map<String, Object> response = new HashMap<>();

        Optional<Account> found = authService.login(account.getEmail(), account.getPassword());
        if (found.isPresent()) {
            Account userAccount = found.get();
            response.put("success", true);
            response.put("message", "Đăng nhập thành công");
            response.put("account", userAccount);
            response.put("role", userAccount.getRole()); // Add role to response
        } else {
            response.put("success", false);
            response.put("message", "Sai email hoặc mật khẩu");
        }

        return response;
    }
    // LINH

    
    @GetMapping("/test")
    public Map<String, Object> test() {
        Map<String, Object> res = new HashMap<>();
        res.put("message", "API Auth hoạt động bình thường ✅");
        return res;
    }
}
