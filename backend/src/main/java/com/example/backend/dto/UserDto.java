package com.example.backend.dto;

import com.example.backend.model.Role;
import com.example.backend.model.User;

import java.time.LocalDateTime;

public class UserDto {
    private String id;
    private String name;
    private String email;
    private Role role;
    private String department;
    private String staffOrStudentId;
    private String batchId;
    private String batchCode;
    private LocalDateTime createdAt;

    public UserDto() {}

    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.department = user.getDepartment();
        this.staffOrStudentId = user.getStaffOrStudentId();
        this.batchId = user.getBatchId();
        this.batchCode = user.getBatchCode();
        this.createdAt = user.getCreatedAt();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getStaffOrStudentId() {
        return staffOrStudentId;
    }

    public void setStaffOrStudentId(String staffOrStudentId) {
        this.staffOrStudentId = staffOrStudentId;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public String getBatchCode() {
        return batchCode;
    }

    public void setBatchCode(String batchCode) {
        this.batchCode = batchCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
