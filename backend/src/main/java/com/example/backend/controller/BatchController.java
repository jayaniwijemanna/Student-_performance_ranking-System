package com.example.backend.controller;

import com.example.backend.model.Batch;
import com.example.backend.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @GetMapping
    public ResponseEntity<List<Batch>> getAllBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Batch>> getBatchesByCourseId(@PathVariable String courseId) {
        return ResponseEntity.ok(batchService.getBatchesByCourseId(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBatchById(@PathVariable String id) {
        return batchService.getBatchById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBatch(@RequestBody Batch batch) {
        try {
            Batch created = batchService.createBatch(batch);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBatch(@PathVariable String id, @RequestBody Batch batch) {
        try {
            Batch updated = batchService.updateBatch(id, batch);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBatch(@PathVariable String id) {
        try {
            batchService.deleteBatch(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Batch deleted successfully");
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }
}
