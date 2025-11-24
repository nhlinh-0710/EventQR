package com.eventqr.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    private String name;
    private String email;

    @Column(name = "password_hash")
    private String password;

    private String phone;
    private String role;
    private Boolean is_active;
    private Timestamp created_at;
    private Timestamp updated_at;

    // Default Constructor (equivalent to @NoArgsConstructor)
    public Account() {
    }

    // All-Args Constructor (equivalent to @AllArgsConstructor)
    public Account(Long user_id, String name, String email, String password, String phone, String role, Boolean is_active, Timestamp created_at, Timestamp updated_at) {
        this.user_id = user_id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.is_active = is_active;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    // --- Getters ---

    public Long getUser_id() {
        return user_id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }

    public String getRole() {
        return role;
    }

    public Boolean getIs_active() {
        return is_active;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public Timestamp getUpdated_at() {
        return updated_at;
    }

    // --- Setters ---

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setIs_active(Boolean is_active) {
        this.is_active = is_active;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public void setUpdated_at(Timestamp updated_at) {
        this.updated_at = updated_at;
    }
    
   
}