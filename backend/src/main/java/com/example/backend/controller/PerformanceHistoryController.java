package com.example.backend.controller;

import com.example.backend.service.PerformanceHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * PerformanceHistoryController — REST API endpoints for the Singly Linked List
 * based performance history tracker.
 *
 * Endpoints:
 *   GET /api/history/student/{studentId}           — Full history for a student (Student's own view)
 *   GET /api/history/student/{studentId}/modules    — History grouped by module
 *   GET /api/history/student/{studentId}/module/{moduleCode} — History for specific module
 *   GET /api/history/batch/{batchCode}              — All students' history in a batch (Lecturer view)
 */
@RestController
@RequestMapping("/api/history")
public class PerformanceHistoryController {

    @Autowired
    private PerformanceHistoryService historyService;

    /**
     * GET /api/history/student/{studentId}
     * Returns the full performance history for a student using Singly Linked List traversal.
     * Used by: Student (own history) and Lecturer (selected student)
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentHistory(@PathVariable String studentId) {
        return ResponseEntity.ok(historyService.getStudentHistory(studentId));
    }

    /**
     * GET /api/history/student/{studentId}/modules
     * Returns history grouped by module. Each module has its own Singly Linked List
     * with independent trend analysis.
     * Used by: Student (own module-level trends) and Lecturer
     */
    @GetMapping("/student/{studentId}/modules")
    public ResponseEntity<List<Map<String, Object>>> getStudentHistoryByModule(@PathVariable String studentId) {
        return ResponseEntity.ok(historyService.getStudentHistoryByModule(studentId));
    }

    /**
     * GET /api/history/student/{studentId}/module/{moduleCode}
     * Returns history for a specific student–module pair.
     */
    @GetMapping("/student/{studentId}/module/{moduleCode}")
    public ResponseEntity<Map<String, Object>> getStudentModuleHistory(
            @PathVariable String studentId, @PathVariable String moduleCode) {
        return ResponseEntity.ok(
                historyService.buildLinkedListForStudentModule(studentId, moduleCode).toSummaryResponse()
        );
    }

    /**
     * GET /api/history/batch/{batchCode}
     * Returns all students' history in a batch, grouped by studentId.
     * Used by: Lecturer (to see all relevant students' trends)
     */
    @GetMapping("/batch/{batchCode}")
    public ResponseEntity<List<Map<String, Object>>> getBatchHistory(@PathVariable String batchCode) {
        return ResponseEntity.ok(historyService.getBatchHistory(batchCode));
    }
}
