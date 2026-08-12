package com.example.backend.service;

import com.example.backend.ds.AVLNode;
import com.example.backend.ds.AVLTree;
import com.example.backend.model.StudentPerformance;
import com.example.backend.repository.StudentPerformanceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    @Autowired
    private StudentPerformanceRepository performanceRepository;

    private final AVLTree avlTree = new AVLTree();

    @PostConstruct
    public void initAVLTreeFromDatabase() {
        rebuildAVLTree();
    }

    public synchronized void rebuildAVLTree() {
        this.avlTree.setRoot(null);
        List<StudentPerformance> allRecords = performanceRepository.findAll();
        for (StudentPerformance perf : allRecords) {
            AVLNode node = convertToAVLNode(perf);
            avlTree.insert(node);
        }
    }

    public StudentPerformance savePerformance(StudentPerformance perfInput) {
        if (perfInput.getStudentName() == null || perfInput.getStudentName().trim().isEmpty()) {
            perfInput.setStudentName("Student (" + perfInput.getStudentId() + ")");
        }
        if (perfInput.getStudentId() == null || perfInput.getStudentId().trim().isEmpty()) {
            if (perfInput.getStudentName() != null && !perfInput.getStudentName().trim().isEmpty()) {
                perfInput.setStudentId("STD-" + Math.abs(perfInput.getStudentName().hashCode() % 10000));
            } else {
                throw new IllegalArgumentException("Student selection is required");
            }
        }
        if (perfInput.getModuleCode() == null || perfInput.getModuleCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Module code selection is required");
        }

        // Calculate performance score using formula: (Assignment * 0.30) + (Exam * 0.60) + (Attendance * 0.10)
        double score = AVLTree.calculatePerformanceScore(
                perfInput.getAssignmentMarks(),
                perfInput.getExamMarks(),
                perfInput.getAttendancePercentage()
        );

        String category = AVLTree.classifyPerformanceCategory(score);
        String status = AVLTree.classifyStatus(score, perfInput.getAttendancePercentage());

        perfInput.setPerformanceScore(score);
        perfInput.setPerformanceCategory(category);
        perfInput.setStatus(status);

        // Check if performance entry for (studentId, moduleCode) already exists
        Optional<StudentPerformance> existingOpt = performanceRepository.findByStudentIdAndModuleCode(
                perfInput.getStudentId(), perfInput.getModuleCode()
        );

        StudentPerformance saved;
        if (existingOpt.isPresent()) {
            StudentPerformance existing = existingOpt.get();
            existing.setStudentName(perfInput.getStudentName());
            existing.setCourseCode(perfInput.getCourseCode());
            existing.setBatchCode(perfInput.getBatchCode());
            existing.setModuleName(perfInput.getModuleName());
            existing.setLecturerId(perfInput.getLecturerId());
            existing.setLecturerName(perfInput.getLecturerName());
            existing.setAssignmentMarks(perfInput.getAssignmentMarks());
            existing.setExamMarks(perfInput.getExamMarks());
            existing.setAttendancePercentage(perfInput.getAttendancePercentage());
            existing.setPerformanceScore(score);
            existing.setPerformanceCategory(category);
            existing.setStatus(status);
            saved = performanceRepository.save(existing);
        } else {
            saved = performanceRepository.save(perfInput);
        }

        // Rebuild / Update AVL Tree
        rebuildAVLTree();

        return saved;
    }

    public List<Map<String, Object>> getRankedStudents(String batchCode, String moduleCode) {
        List<AVLNode> sortedNodes = avlTree.getRankedStudentsDescending();

        List<Map<String, Object>> rankedList = new ArrayList<>();
        int rank = 1;
        for (AVLNode n : sortedNodes) {
            boolean matchesBatch = (batchCode == null || batchCode.isEmpty() || "ALL".equalsIgnoreCase(batchCode) || batchCode.equals(n.getBatchCode()));
            boolean matchesModule = (moduleCode == null || moduleCode.isEmpty() || "ALL".equalsIgnoreCase(moduleCode) || moduleCode.equals(n.getModuleCode()));

            if (matchesBatch && matchesModule) {
                Map<String, Object> map = new HashMap<>();
                map.put("rank", rank++);
                map.put("id", n.getId());
                map.put("studentId", n.getStudentId());
                map.put("studentName", n.getStudentName());
                map.put("courseCode", n.getCourseCode());
                map.put("batchCode", n.getBatchCode());
                map.put("moduleCode", n.getModuleCode());
                map.put("moduleName", n.getModuleName());
                map.put("assignmentMarks", n.getAssignmentMarks());
                map.put("examMarks", n.getExamMarks());
                map.put("attendancePercentage", n.getAttendancePercentage());
                map.put("performanceScore", n.getPerformanceScore());
                map.put("performanceCategory", n.getPerformanceCategory());
                map.put("status", n.getStatus());
                rankedList.add(map);
            }
        }
        return rankedList;
    }

    public List<AVLNode> searchByScore(double score) {
        return avlTree.searchByScore(score);
    }

    public List<AVLNode> getAtRiskStudents() {
        return avlTree.getAtRiskStudents();
    }

    public Map<String, Object> getAVLTreeGraph(String batchCode, String moduleCode) {
        AVLTree filteredTree = new AVLTree();
        List<StudentPerformance> allRecords = performanceRepository.findAll();
        for (StudentPerformance perf : allRecords) {
            boolean matchesBatch = (batchCode == null || batchCode.isEmpty() || "ALL".equalsIgnoreCase(batchCode) || batchCode.equals(perf.getBatchCode()));
            boolean matchesModule = (moduleCode == null || moduleCode.isEmpty() || "ALL".equalsIgnoreCase(moduleCode) || moduleCode.equals(perf.getModuleCode()));

            if (matchesBatch && matchesModule) {
                AVLNode node = convertToAVLNode(perf);
                filteredTree.insert(node);
            }
        }
        return filteredTree.toTreeGraph();
    }

    public void deletePerformance(String id) {
        if (!performanceRepository.existsById(id)) {
            throw new IllegalArgumentException("Performance record not found with id: " + id);
        }
        performanceRepository.deleteById(id);
        rebuildAVLTree();
    }

    private AVLNode convertToAVLNode(StudentPerformance perf) {
        return new AVLNode(
                perf.getId(),
                perf.getStudentId(),
                perf.getStudentName(),
                perf.getCourseCode(),
                perf.getBatchCode(),
                perf.getModuleCode(),
                perf.getModuleName(),
                perf.getAssignmentMarks(),
                perf.getExamMarks(),
                perf.getAttendancePercentage(),
                perf.getPerformanceScore(),
                perf.getPerformanceCategory(),
                perf.getStatus()
        );
    }
}
