package com.example.backend.ds;

import java.time.LocalDateTime;

/**
 * HistoryNode — A single node in the Singly Linked List.
 *
 * Each node stores one performance evaluation snapshot (assignment marks,
 * exam marks, attendance, calculated score, and the timestamp) for a
 * particular student–module pair.
 *
 * The 'next' pointer links to the previous (older) evaluation entry,
 * forming a chronological chain from newest → oldest.
 *
 * Time Complexity:
 *   - Insertion at head: O(1)
 *   - Traversal (display history): O(n) where n = number of entries
 */
public class HistoryNode {

    // --- Data Fields ---
    private String entryId;            // MongoDB document ID of the history entry
    private String studentId;          // Student registration/staff ID
    private String studentName;        // Student display name
    private String moduleCode;         // Module code (e.g. "CS101")
    private String moduleName;         // Module display name
    private String batchCode;          // Batch code (e.g. "DS-2024-B1")
    private double assignmentMarks;    // Assignment marks at this point
    private double examMarks;          // Exam marks at this point
    private double attendancePercentage; // Attendance % at this point
    private double performanceScore;   // Weighted score at this point
    private String performanceCategory; // Category (Excellent/Good/At Risk etc.)
    private String status;             // Good Standing / At Risk
    private LocalDateTime timestamp;   // When this evaluation was recorded
    private String action;             // "CREATED" | "UPDATED" | "DELETED"

    // --- Singly Linked List Pointer ---
    private HistoryNode next;          // Pointer to the next (older) node

    // --- Constructors ---
    public HistoryNode() {
        this.next = null;
    }

    public HistoryNode(String entryId, String studentId, String studentName,
                       String moduleCode, String moduleName, String batchCode,
                       double assignmentMarks, double examMarks,
                       double attendancePercentage, double performanceScore,
                       String performanceCategory, String status,
                       LocalDateTime timestamp, String action) {
        this.entryId = entryId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.moduleCode = moduleCode;
        this.moduleName = moduleName;
        this.batchCode = batchCode;
        this.assignmentMarks = assignmentMarks;
        this.examMarks = examMarks;
        this.attendancePercentage = attendancePercentage;
        this.performanceScore = performanceScore;
        this.performanceCategory = performanceCategory;
        this.status = status;
        this.timestamp = timestamp;
        this.action = action;
        this.next = null;
    }

    // --- Getters and Setters ---
    public String getEntryId() { return entryId; }
    public void setEntryId(String entryId) { this.entryId = entryId; }

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

    public HistoryNode getNext() { return next; }
    public void setNext(HistoryNode next) { this.next = next; }
}
