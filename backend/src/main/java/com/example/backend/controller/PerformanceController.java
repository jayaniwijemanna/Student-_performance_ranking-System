package com.example.backend.controller;

import com.example.backend.ds.AVLNode;
import com.example.backend.model.StudentPerformance;
import com.example.backend.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/performances")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    @PostMapping
    public ResponseEntity<?> savePerformance(@RequestBody StudentPerformance performance) {
        try {
            StudentPerformance saved = performanceService.savePerformance(performance);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @GetMapping("/rankings")
    public ResponseEntity<List<Map<String, Object>>> getRankings(
            @RequestParam(required = false) String batchCode,
            @RequestParam(required = false) String moduleCode) {
        return ResponseEntity.ok(performanceService.getRankedStudents(batchCode, moduleCode));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AVLNode>> searchByScore(
            @RequestParam double score,
            @RequestParam(required = false) String batchCode,
            @RequestParam(required = false) String moduleCode) {
        return ResponseEntity.ok(performanceService.searchByScore(score, batchCode, moduleCode));
    }

    @GetMapping("/at-risk")
    public ResponseEntity<List<AVLNode>> getAtRiskStudents() {
        return ResponseEntity.ok(performanceService.getAtRiskStudents());
    }

    @GetMapping("/tree-view")
    public ResponseEntity<Map<String, Object>> getAVLTreeGraph(
            @RequestParam(required = false) String batchCode,
            @RequestParam(required = false) String moduleCode) {
        return ResponseEntity.ok(performanceService.getAVLTreeGraph(batchCode, moduleCode));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePerformance(@PathVariable String id) {
        try {
            performanceService.deletePerformance(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Performance record deleted successfully");
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }
}
