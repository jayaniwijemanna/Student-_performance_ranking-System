package com.example.backend.service;

import com.example.backend.ds.HistoryNode;
import com.example.backend.ds.PerformanceHistoryLinkedList;
import com.example.backend.model.PerformanceHistoryEntry;
import com.example.backend.model.StudentPerformance;
import com.example.backend.repository.PerformanceHistoryRepository;
import com.example.backend.repository.StudentPerformanceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * PerformanceHistoryService — Manages the Singly Linked List data structure
 * for tracking student performance evaluation history.
 *
 * When a lecturer creates or updates marks, this service persists a history
 * snapshot to MongoDB and builds the Singly Linked List in memory for
 * efficient traversal and trend analysis.
 */
@Service
public class PerformanceHistoryService {

    @Autowired
    private PerformanceHistoryRepository historyRepository;

    @Autowired
    private StudentPerformanceRepository performanceRepository;

    /**
     * On startup, check if the history collection is empty.
     * If so, seed it from existing performance records so existing
     * students have at least one history entry.
     */
    @PostConstruct
    public void seedHistoryFromExistingRecords() {
        long historyCount = historyRepository.count();
        if (historyCount == 0) {
            List<StudentPerformance> existingRecords = performanceRepository.findAll();
            if (!existingRecords.isEmpty()) {
                for (StudentPerformance perf : existingRecords) {
                    recordHistory(perf, "CREATED");
                }
                System.out.println("Seeded " + existingRecords.size()
                        + " history entries from existing performance records.");
            }
        }
    }

    /**
     * Record a new history entry when a performance evaluation is created or updated.
     * Persists to MongoDB and can be later loaded into the Singly Linked List.
     *
     * @param perf   The saved StudentPerformance record
     * @param action "CREATED" or "UPDATED"
     */
    public void recordHistory(StudentPerformance perf, String action) {
        PerformanceHistoryEntry entry = new PerformanceHistoryEntry(
                perf.getStudentId(),
                perf.getStudentName(),
                perf.getModuleCode(),
                perf.getModuleName(),
                perf.getBatchCode(),
                perf.getLecturerId(),
                perf.getLecturerName(),
                perf.getAssignmentMarks() != null ? perf.getAssignmentMarks() : 0.0,
                perf.getExamMarks() != null ? perf.getExamMarks() : 0.0,
                perf.getAttendancePercentage() != null ? perf.getAttendancePercentage() : 0.0,
                perf.getPerformanceScore() != null ? perf.getPerformanceScore() : 0.0,
                perf.getPerformanceCategory(),
                perf.getStatus(),
                action
        );
        historyRepository.save(entry);
    }

    /**
     * Build a Singly Linked List from all history entries for a given student.
     *
     * Algorithm:
     *   1. Query MongoDB for all entries sorted by timestamp DESC (newest first)
     *   2. For each entry, create a HistoryNode
     *   3. Insert each node at the head of the linked list — O(1) per insertion
     *      (We insert in reverse order so that the final head = newest entry)
     *
     * Total Time Complexity: O(n) where n = number of history entries
     *
     * @param studentId The student's registration/staff ID
     * @return A fully constructed PerformanceHistoryLinkedList
     */
    public PerformanceHistoryLinkedList buildLinkedListForStudent(String studentId) {
        List<PerformanceHistoryEntry> entries =
                historyRepository.findByStudentIdOrderByTimestampDesc(studentId);

        PerformanceHistoryLinkedList linkedList = new PerformanceHistoryLinkedList();

        // Insert in reverse (oldest first) so newest ends up as head after all insertions
        for (int i = entries.size() - 1; i >= 0; i--) {
            HistoryNode node = convertToHistoryNode(entries.get(i));
            linkedList.insertAtHead(node); // O(1) insertion at head
        }

        return linkedList;
    }

    /**
     * Build a Singly Linked List for a specific student–module pair.
     *
     * @param studentId  The student's registration/staff ID
     * @param moduleCode The module code (e.g. "CS101")
     * @return A filtered PerformanceHistoryLinkedList for that module
     */
    public PerformanceHistoryLinkedList buildLinkedListForStudentModule(String studentId, String moduleCode) {
        List<PerformanceHistoryEntry> entries =
                historyRepository.findByStudentIdAndModuleCodeOrderByTimestampDesc(studentId, moduleCode);

        PerformanceHistoryLinkedList linkedList = new PerformanceHistoryLinkedList();

        for (int i = entries.size() - 1; i >= 0; i--) {
            HistoryNode node = convertToHistoryNode(entries.get(i));
            linkedList.insertAtHead(node);
        }

        return linkedList;
    }

    /**
     * Get the full history response (entries + trend + score change) for a student.
     *
     * @param studentId The student's registration/staff ID
     * @return Map containing "entries", "trend", "scoreChange", "totalEntries"
     */
    public Map<String, Object> getStudentHistory(String studentId) {
        PerformanceHistoryLinkedList linkedList = buildLinkedListForStudent(studentId);
        return linkedList.toSummaryResponse();
    }

    /**
     * Get history grouped by module for a given student.
     * Each module gets its own Singly Linked List with independent trend analysis.
     *
     * @param studentId The student's registration/staff ID
     * @return List of Maps, each containing module info and linked list summary
     */
    public List<Map<String, Object>> getStudentHistoryByModule(String studentId) {
        List<PerformanceHistoryEntry> allEntries =
                historyRepository.findByStudentIdOrderByTimestampDesc(studentId);

        // Group entries by moduleCode
        Map<String, List<PerformanceHistoryEntry>> grouped = allEntries.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getModuleCode() != null ? e.getModuleCode() : "UNKNOWN",
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<Map<String, Object>> moduleHistories = new ArrayList<>();

        for (Map.Entry<String, List<PerformanceHistoryEntry>> group : grouped.entrySet()) {
            String moduleCode = group.getKey();
            List<PerformanceHistoryEntry> moduleEntries = group.getValue();

            // Build a separate Singly Linked List for each module
            PerformanceHistoryLinkedList moduleLinkedList = new PerformanceHistoryLinkedList();
            for (int i = moduleEntries.size() - 1; i >= 0; i--) {
                HistoryNode node = convertToHistoryNode(moduleEntries.get(i));
                moduleLinkedList.insertAtHead(node);
            }

            Map<String, Object> moduleHistory = new HashMap<>();
            moduleHistory.put("moduleCode", moduleCode);
            moduleHistory.put("moduleName", moduleEntries.get(0).getModuleName());
            moduleHistory.put("trend", moduleLinkedList.getTrend());
            moduleHistory.put("scoreChange", Math.round(moduleLinkedList.getScoreChange() * 100.0) / 100.0);
            moduleHistory.put("totalEntries", moduleLinkedList.getSize());
            moduleHistory.put("entries", moduleLinkedList.toListOfMaps());
            moduleHistories.add(moduleHistory);
        }

        return moduleHistories;
    }

    /**
     * Get all history for students in a specific batch (for lecturer view).
     * Groups by studentId, each student gets their own linked list and trend.
     *
     * @param batchCode The batch code (e.g. "DS-2024-B1")
     * @return List of Maps, each containing student info and their history summary
     */
    public List<Map<String, Object>> getBatchHistory(String batchCode) {
        List<PerformanceHistoryEntry> batchEntries =
                historyRepository.findByBatchCodeOrderByTimestampDesc(batchCode);

        // Group by studentId
        Map<String, List<PerformanceHistoryEntry>> grouped = batchEntries.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getStudentId() != null ? e.getStudentId() : "UNKNOWN",
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<Map<String, Object>> studentHistories = new ArrayList<>();

        for (Map.Entry<String, List<PerformanceHistoryEntry>> group : grouped.entrySet()) {
            String studentId = group.getKey();
            List<PerformanceHistoryEntry> studentEntries = group.getValue();

            // Build Singly Linked List for this student
            PerformanceHistoryLinkedList studentLinkedList = new PerformanceHistoryLinkedList();
            for (int i = studentEntries.size() - 1; i >= 0; i--) {
                HistoryNode node = convertToHistoryNode(studentEntries.get(i));
                studentLinkedList.insertAtHead(node);
            }

            Map<String, Object> studentHistory = new HashMap<>();
            studentHistory.put("studentId", studentId);
            studentHistory.put("studentName", studentEntries.get(0).getStudentName());
            studentHistory.put("batchCode", batchCode);
            studentHistory.put("trend", studentLinkedList.getTrend());
            studentHistory.put("scoreChange", Math.round(studentLinkedList.getScoreChange() * 100.0) / 100.0);
            studentHistory.put("totalEntries", studentLinkedList.getSize());
            studentHistory.put("entries", studentLinkedList.toListOfMaps());
            studentHistories.add(studentHistory);
        }

        return studentHistories;
    }

    /**
     * Convert a MongoDB document to a HistoryNode for the linked list.
     */
    private HistoryNode convertToHistoryNode(PerformanceHistoryEntry entry) {
        return new HistoryNode(
                entry.getId(),
                entry.getStudentId(),
                entry.getStudentName(),
                entry.getModuleCode(),
                entry.getModuleName(),
                entry.getBatchCode(),
                entry.getAssignmentMarks(),
                entry.getExamMarks(),
                entry.getAttendancePercentage(),
                entry.getPerformanceScore(),
                entry.getPerformanceCategory(),
                entry.getStatus(),
                entry.getTimestamp(),
                entry.getAction()
        );
    }
}
