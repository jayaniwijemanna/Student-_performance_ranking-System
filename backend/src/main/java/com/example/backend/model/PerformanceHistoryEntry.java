package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * PerformanceHistoryEntry — MongoDB document storing a single snapshot
 * of a student's evaluation at a specific point in time.
 *
 * Every time a lecturer creates or updates marks, a new history entry
 * is persisted. These entries are loaded into the Singly Linked List
 * data structure at runtime to enable O(1) head insertion and O(n)
 * chronological traversal.
 */
@Document(collection = "performance_history")
public class PerformanceHistoryEntry {

    @Id
    private String id;

    private String studentId;
    private String studentName;
    private String moduleCode;
    private String moduleName;
    private String batchCode;
    private String lecturerId;
    private String lecturerName;
    private double assignmentMarks;
    private double examMarks;
    private double attendancePercentage;
    private double performanceScore;
    private String performanceCategory;
    private String status;
    private LocalDateTime timestamp;
    private String action; // "CREATED" | "UPDATED" | "DELETED"

    public PerformanceHistoryEntry() {
        this.timestamp = LocalDateTime.now();
    }

    public PerformanceHistoryEntry(String studentId, String studentName,
                                    String moduleCode, String moduleName,
                                    String batchCode, String lecturerId,
                                    String lecturerName,
                                    double assignmentMarks, double examMarks,
                                    double attendancePercentage,
                                    double performanceScore,
                                    String performanceCategory, String status,
                                    String action) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.moduleCode = moduleCode;
        this.moduleName = moduleName;
        this.batchCode = batchCode;
        this.lecturerId = lecturerId;
        this.lecturerName = lecturerName;
        this.assignmentMarks = assignmentMarks;
        this.examMarks = examMarks;
        this.attendancePercentage = attendancePercentage;
        this.performanceScore = performanceScore;
        this.performanceCategory = performanceCategory;
        this.status = status;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getModuleCode() { return moduleCode; }
    public void setModuleCode(String moduleCode) { this.moduleCode = moduleCode; }

    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }

    public String getBatchCode() { return batchCode; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }

    public String getLecturerId() { return lecturerId; }
    public void setLecturerId(String lecturerId) { this.lecturerId = lecturerId; }

    public String getLecturerName() { return lecturerName; }
    public void setLecturerName(String lecturerName) { this.lecturerName = lecturerName; }

    public double getAssignmentMarks() { return assignmentMarks; }
    public void setAssignmentMarks(double assignmentMarks) { this.assignmentMarks = assignmentMarks; }

    public double getExamMarks() { return examMarks; }
    public void setExamMarks(double examMarks) { this.examMarks = examMarks; }

    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public double getPerformanceScore() { return performanceScore; }
    public void setPerformanceScore(double performanceScore) { this.performanceScore = performanceScore; }

    public String getPerformanceCategory() { return performanceCategory; }
    public void setPerformanceCategory(String performanceCategory) { this.performanceCategory = performanceCategory; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
