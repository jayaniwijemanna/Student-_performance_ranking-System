package com.example.backend.repository;

import com.example.backend.model.StudentPerformance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentPerformanceRepository extends MongoRepository<StudentPerformance, String> {

    List<StudentPerformance> findByBatchCode(String batchCode);

    List<StudentPerformance> findByModuleCode(String moduleCode);

    List<StudentPerformance> findByStudentId(String studentId);

    List<StudentPerformance> findByLecturerId(String lecturerId);

    Optional<StudentPerformance> findByStudentIdAndModuleCode(String studentId, String moduleCode);
}
