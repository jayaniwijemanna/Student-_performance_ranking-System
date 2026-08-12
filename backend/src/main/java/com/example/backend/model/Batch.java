package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "batches")
public class Batch {

    @Id
    private String id;

    private String courseId;

    private String courseCode;

    @Indexed(unique = true)
    private String batchCode;

    private String batchName;

    private String academicYear;

    private String semester;

    private String status; // ACTIVE, COMPLETED, UPCOMING

    private LocalDateTime createdAt;

    public Batch() {
        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
    }

    public Batch(String courseId, String courseCode, String batchCode, String batchName, String academicYear, String semester, String status) {
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.batchCode = batchCode;
        this.batchName = batchName;
        this.academicYear = academicYear;
        this.semester = semester;
        this.status = status != null ? status : "ACTIVE";
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getBatchCode() {
        return batchCode;
    }

    public void setBatchCode(String batchCode) {
        this.batchCode = batchCode;
    }

    public String getBatchName() {
        return batchName;
    }

    public void setBatchName(String batchName) {
        this.batchName = batchName;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
