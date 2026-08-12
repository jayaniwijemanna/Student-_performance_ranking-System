package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "student_performances")
public class StudentPerformance {

    @Id
    private String id;

    private String studentId;

    private String studentName;

    private String courseCode;

    private String batchCode;

    private String moduleCode;

    private String moduleName;

    private String lecturerId;

    private String lecturerName;

    private Double assignmentMarks = 0.0;

    private Double examMarks = 0.0;

    private Double attendancePercentage = 0.0;

    private Double performanceScore = 0.0;

    private String performanceCategory;

    private String status;

    private LocalDateTime createdAt;

    public StudentPerformance() {
        this.createdAt = LocalDateTime.now();
    }

    public StudentPerformance(String studentId, String studentName, String courseCode, String batchCode, String moduleCode, String moduleName, String lecturerId, String lecturerName, Double assignmentMarks, Double examMarks, Double attendancePercentage, Double performanceScore, String performanceCategory, String status) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.courseCode = courseCode;
        this.batchCode = batchCode;
        this.moduleCode = moduleCode;
        this.moduleName = moduleName;
        this.lecturerId = lecturerId;
        this.lecturerName = lecturerName;
        this.assignmentMarks = assignmentMarks != null ? assignmentMarks : 0.0;
        this.examMarks = examMarks != null ? examMarks : 0.0;
        this.attendancePercentage = attendancePercentage != null ? attendancePercentage : 0.0;
        this.performanceScore = performanceScore != null ? performanceScore : 0.0;
        this.performanceCategory = performanceCategory;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
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

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(String lecturerId) {
        this.lecturerId = lecturerId;
    }

    public String getLecturerName() {
        return lecturerName;
    }

    public void setLecturerName(String lecturerName) {
        this.lecturerName = lecturerName;
    }

    public Double getAssignmentMarks() {
        return assignmentMarks != null ? assignmentMarks : 0.0;
    }

    public void setAssignmentMarks(Double assignmentMarks) {
        this.assignmentMarks = assignmentMarks != null ? assignmentMarks : 0.0;
    }

    public Double getExamMarks() {
        return examMarks != null ? examMarks : 0.0;
    }

    public void setExamMarks(Double examMarks) {
        this.examMarks = examMarks != null ? examMarks : 0.0;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage != null ? attendancePercentage : 0.0;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage != null ? attendancePercentage : 0.0;
    }

    public Double getPerformanceScore() {
        return performanceScore != null ? performanceScore : 0.0;
    }

    public void setPerformanceScore(Double performanceScore) {
        this.performanceScore = performanceScore != null ? performanceScore : 0.0;
    }

    public String getPerformanceCategory() {
        return performanceCategory;
    }

    public void setPerformanceCategory(String performanceCategory) {
        this.performanceCategory = performanceCategory;
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
