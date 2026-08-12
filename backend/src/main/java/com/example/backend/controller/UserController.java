package com.example.backend.controller;

import com.example.backend.dto.SignUpRequest;
import com.example.backend.dto.UserDto;
import com.example.backend.model.Role;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/role/{roleStr}")
    public ResponseEntity<?> getUsersByRole(@PathVariable String roleStr) {
        try {
            Role role = Role.valueOf(roleStr.toUpperCase());
            return ResponseEntity.ok(userService.getUsersByRole(role));
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid role specified: " + roleStr);
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody SignUpRequest request) {
        try {
            UserDto created = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody SignUpRequest request) {
        try {
            UserDto updated = userService.updateUser(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PutMapping("/{id}/assign-batches")
    public ResponseEntity<?> assignBatches(@PathVariable String id, @RequestBody Map<String, List<String>> payload) {
        try {
            List<String> batchIds = payload.getOrDefault("batchIds", List.of());
            UserDto updated = userService.assignBatchesToLecturer(id, batchIds);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "User deleted successfully");
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }
}
