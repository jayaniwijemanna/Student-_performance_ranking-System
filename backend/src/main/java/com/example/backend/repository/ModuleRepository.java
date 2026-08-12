package com.example.backend.repository;

import com.example.backend.model.Module;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends MongoRepository<Module, String> {

    List<Module> findByLecturerId(String lecturerId);

    List<Module> findByBatchId(String batchId);

    List<Module> findByBatchCode(String batchCode);

    boolean existsByModuleCodeAndBatchId(String moduleCode, String batchId);
}
