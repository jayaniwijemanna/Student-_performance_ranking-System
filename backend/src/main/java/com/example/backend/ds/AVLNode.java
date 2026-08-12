package com.example.backend.ds;

public class AVLNode {

    private String id; // MongoDB Performance Record ID
    private String studentId;
    private String studentName;
    private String courseCode;
    private String batchCode;
    private String moduleCode;
    private String moduleName;
    private double assignmentMarks;
    private double examMarks;
    private double attendancePercentage;
    private double performanceScore;
    private String performanceCategory;
    private String status;
    private int height;

    private AVLNode left;
    private AVLNode right;

    public AVLNode() {
        this.height = 1;
    }

    public AVLNode(String id, String studentId, String studentName, String courseCode, String batchCode,
                   String moduleCode, String moduleName, double assignmentMarks, double examMarks,
                   double attendancePercentage, double performanceScore, String performanceCategory, String status) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.courseCode = courseCode;
        this.batchCode = batchCode;
        this.moduleCode = moduleCode;
        this.moduleName = moduleName;
        this.assignmentMarks = assignmentMarks;
        this.examMarks = examMarks;
        this.attendancePercentage = attendancePercentage;
        this.performanceScore = performanceScore;
        this.performanceCategory = performanceCategory;
        this.status = status;
        this.height = 1;
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

    public double getAssignmentMarks() {
        return assignmentMarks;
    }

    public void setAssignmentMarks(double assignmentMarks) {
        this.assignmentMarks = assignmentMarks;
    }

    public double getExamMarks() {
        return examMarks;
    }

    public void setExamMarks(double examMarks) {
        this.examMarks = examMarks;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public double getPerformanceScore() {
        return performanceScore;
    }

    public void setPerformanceScore(double performanceScore) {
        this.performanceScore = performanceScore;
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

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public AVLNode getLeft() {
        return left;
    }

    public void setLeft(AVLNode left) {
        this.left = left;
    }

    public AVLNode getRight() {
        return right;
    }

    public void setRight(AVLNode right) {
        this.right = right;
    }
}
