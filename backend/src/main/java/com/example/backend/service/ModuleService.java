package com.example.backend.service;

import com.example.backend.model.Batch;
import com.example.backend.model.Module;
import com.example.backend.repository.BatchRepository;
import com.example.backend.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private BatchRepository batchRepository;

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public List<Module> getModulesByLecturer(String lecturerId) {
        return moduleRepository.findByLecturerId(lecturerId);
    }

    public List<Module> getModulesByBatch(String batchId) {
        return moduleRepository.findByBatchId(batchId);
    }

    public List<Module> getModulesByBatchCode(String batchCode) {
        return moduleRepository.findByBatchCode(batchCode);
    }

    public Module createModule(Module module) {
        if (module.getModuleCode() == null || module.getModuleCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Module code is required");
        }
        if (module.getModuleName() == null || module.getModuleName().trim().isEmpty()) {
            throw new IllegalArgumentException("Module title/name is required");
        }
        if (module.getBatchId() == null || module.getBatchId().trim().isEmpty()) {
            throw new IllegalArgumentException("Target batch is required");
        }

        // If batchCode is missing, resolve from batchRepository
        if (module.getBatchCode() == null || module.getBatchCode().trim().isEmpty()) {
            Optional<Batch> bOpt = batchRepository.findById(module.getBatchId());
            bOpt.ifPresent(batch -> module.setBatchCode(batch.getBatchCode()));
        }

        return moduleRepository.save(module);
    }

    public Module updateModule(String id, Module updatedData) {
        Module existing = moduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Module not found with id: " + id));

        if (updatedData.getModuleCode() != null) existing.setModuleCode(updatedData.getModuleCode());
        if (updatedData.getModuleName() != null) existing.setModuleName(updatedData.getModuleName());
        if (updatedData.getCredits() > 0) existing.setCredits(updatedData.getCredits());
        if (updatedData.getBatchId() != null) {
            existing.setBatchId(updatedData.getBatchId());
            if (updatedData.getBatchCode() != null) {
                existing.setBatchCode(updatedData.getBatchCode());
            } else {
                batchRepository.findById(updatedData.getBatchId())
                        .ifPresent(b -> existing.setBatchCode(b.getBatchCode()));
            }
        }
        if (updatedData.getSemester() != null) existing.setSemester(updatedData.getSemester());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());

        return moduleRepository.save(existing);
    }

    public void deleteModule(String id) {
        if (!moduleRepository.existsById(id)) {
            throw new IllegalArgumentException("Module not found with id: " + id);
        }
        moduleRepository.deleteById(id);
    }
}
