package com.example.backend.controller;

import com.example.backend.model.Module;
import com.example.backend.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/lecturer/{lecturerId}")
    public ResponseEntity<List<Module>> getModulesByLecturer(@PathVariable String lecturerId) {
        return ResponseEntity.ok(moduleService.getModulesByLecturer(lecturerId));
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<Module>> getModulesByBatch(@PathVariable String batchId) {
        return ResponseEntity.ok(moduleService.getModulesByBatch(batchId));
    }

    @GetMapping("/batch-code/{batchCode}")
    public ResponseEntity<List<Module>> getModulesByBatchCode(@PathVariable String batchCode) {
        return ResponseEntity.ok(moduleService.getModulesByBatchCode(batchCode));
    }

    @PostMapping
    public ResponseEntity<?> createModule(@RequestBody Module module) {
        try {
            Module created = moduleService.createModule(module);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateModule(@PathVariable String id, @RequestBody Module module) {
        try {
            Module updated = moduleService.updateModule(id, module);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteModule(@PathVariable String id) {
        try {
            moduleService.deleteModule(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Module deleted successfully");
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }
}
