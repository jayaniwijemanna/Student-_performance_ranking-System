package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired(required = false)
    private MongoTemplate mongoTemplate;

    @GetMapping("/health")
    public Map<String, Object> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Spring Boot Backend API");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("version", "1.0.0");

        Map<String, Object> mongoInfo = new HashMap<>();
        mongoInfo.put("uri", "mongodb://127.0.0.1:27017/student_performance_ranking_db");
        
        if (mongoTemplate != null) {
            try {
                String dbName = mongoTemplate.getDb().getName();
                mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
                mongoInfo.put("status", "CONNECTED");
                mongoInfo.put("database", dbName);
            } catch (Exception e) {
                mongoInfo.put("status", "DISCONNECTED");
                mongoInfo.put("error", e.getMessage());
            }
        } else {
            mongoInfo.put("status", "NOT_CONFIGURED");
        }
        
        response.put("mongodb", mongoInfo);
        return response;
    }
}
