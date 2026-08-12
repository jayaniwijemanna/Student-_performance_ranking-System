package com.example.backend.service;

import com.example.backend.model.Batch;
import com.example.backend.model.Course;
import com.example.backend.repository.BatchRepository;
import com.example.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public List<Batch> getBatchesByCourseId(String courseId) {
        return batchRepository.findByCourseId(courseId);
    }

    public Optional<Batch> getBatchById(String id) {
        return batchRepository.findById(id);
    }

    public Batch createBatch(Batch batch) {
        if (batch.getBatchCode() != null) {
            batch.setBatchCode(batch.getBatchCode().trim().toUpperCase());
        }
        if (batchRepository.existsByBatchCode(batch.getBatchCode())) {
            throw new IllegalArgumentException("Batch with code '" + batch.getBatchCode() + "' already exists");
        }

        // Enrich with courseCode if courseId is provided
        if (batch.getCourseId() != null) {
            Optional<Course> courseOpt = courseRepository.findById(batch.getCourseId());
            courseOpt.ifPresent(course -> batch.setCourseCode(course.getCode()));
        }

        return batchRepository.save(batch);
    }

    public Batch updateBatch(String id, Batch updatedBatch) {
        Batch existing = batchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Batch not found with id: " + id));

        if (updatedBatch.getBatchCode() != null && !updatedBatch.getBatchCode().trim().equalsIgnoreCase(existing.getBatchCode())) {
            String newCode = updatedBatch.getBatchCode().trim().toUpperCase();
            if (batchRepository.existsByBatchCode(newCode)) {
                throw new IllegalArgumentException("Batch with code '" + newCode + "' already exists");
            }
            existing.setBatchCode(newCode);
        }

        if (updatedBatch.getCourseId() != null) {
            existing.setCourseId(updatedBatch.getCourseId());
            courseRepository.findById(updatedBatch.getCourseId())
                    .ifPresent(course -> existing.setCourseCode(course.getCode()));
        }

        existing.setBatchName(updatedBatch.getBatchName());
        existing.setAcademicYear(updatedBatch.getAcademicYear());
        existing.setSemester(updatedBatch.getSemester());
        if (updatedBatch.getStatus() != null) {
            existing.setStatus(updatedBatch.getStatus());
        }

        return batchRepository.save(existing);
    }

    public void deleteBatch(String id) {
        if (!batchRepository.existsById(id)) {
            throw new IllegalArgumentException("Batch not found with id: " + id);
        }
        batchRepository.deleteById(id);
    }
}
