package com.example.backend.repository;

import com.example.backend.model.PerformanceHistoryEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceHistoryRepository extends MongoRepository<PerformanceHistoryEntry, String> {

    /**
     * Find all history entries for a specific student, ordered by timestamp descending (newest first).
     */
    List<PerformanceHistoryEntry> findByStudentIdOrderByTimestampDesc(String studentId);

    /**
     * Find all history entries for a specific student and module, ordered by timestamp descending.
     */
    List<PerformanceHistoryEntry> findByStudentIdAndModuleCodeOrderByTimestampDesc(String studentId, String moduleCode);

    /**
     * Find all history entries for a specific batch, ordered by timestamp descending.
     */
    List<PerformanceHistoryEntry> findByBatchCodeOrderByTimestampDesc(String batchCode);

    /**
     * Find all history entries recorded by a specific lecturer, ordered by timestamp descending.
     */
    List<PerformanceHistoryEntry> findByLecturerIdOrderByTimestampDesc(String lecturerId);
}
