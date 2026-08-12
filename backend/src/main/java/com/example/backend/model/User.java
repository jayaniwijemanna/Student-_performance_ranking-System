package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private Role role;

    private String department;

    private String staffOrStudentId;

    private String batchId;

    private String batchCode;

    // For Lecturers: multiple assigned batches
    private List<String> assignedBatchIds = new ArrayList<>();

    private List<String> assignedBatchCodes = new ArrayList<>();

    private LocalDateTime createdAt;

    public User() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String name, String email, String password, Role role, String department, String staffOrStudentId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.staffOrStudentId = staffOrStudentId;
        this.createdAt = LocalDateTime.now();
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public List<String> getAssignedBatchIds() {
        return assignedBatchIds;
    }

    public void setAssignedBatchIds(List<String> assignedBatchIds) {
        this.assignedBatchIds = assignedBatchIds != null ? assignedBatchIds : new ArrayList<>();
    }

    public List<String> getAssignedBatchCodes() {
        return assignedBatchCodes;
    }

    public void setAssignedBatchCodes(List<String> assignedBatchCodes) {
        this.assignedBatchCodes = assignedBatchCodes != null ? assignedBatchCodes : new ArrayList<>();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
