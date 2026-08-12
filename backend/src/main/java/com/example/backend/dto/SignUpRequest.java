package com.example.backend.dto;

import com.example.backend.model.Role;

public class SignUpRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String department;
    private String staffOrStudentId;
    private String batchId;
    private String batchCode;

    public SignUpRequest() {}

    public SignUpRequest(String name, String email, String password, Role role, String department, String staffOrStudentId, String batchId, String batchCode) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.staffOrStudentId = staffOrStudentId;
        this.batchId = batchId;
        this.batchCode = batchCode;
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
}
