package com.example.backend.seeder;

import com.example.backend.model.StudentPerformance;
import com.example.backend.repository.StudentPerformanceRepository;
import com.example.backend.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class PerformanceSeeder implements CommandLineRunner {

    @Autowired
    private StudentPerformanceRepository performanceRepository;

    @Autowired
    private PerformanceService performanceService;

    @Override
    public void run(String... args) throws Exception {
        if (performanceRepository.count() == 0) {
            System.out.println("Seeding sample student evaluations into AVL Tree...");

            // Sample Students for DSA1 evaluation ranking demonstration
            saveSample("ST001", "Amal Perera", "SE202", "DS-2024-B1", "DSA1", "Data Structures and Algorithm", 90.0, 92.0, 95.0);
            saveSample("ST002", "Kamal Silva", "SE202", "DS-2024-B1", "DSA1", "Data Structures and Algorithm", 80.0, 85.0, 90.0);
            saveSample("ST003", "Sunil Fernando", "SE202", "DS-2024-B1", "DSA1", "Data Structures and Algorithm", 75.0, 75.0, 80.0);
            saveSample("ST004", "Nimal Wickrama", "SE202", "DS-2024-B1", "DSA1", "Data Structures and Algorithm", 65.0, 68.0, 75.0);
            saveSample("ST005", "Kasun Jayasinghe", "SE202", "DS-2024-B1", "DSA1", "Data Structures and Algorithm", 40.0, 45.0, 60.0);
            saveSample("ST007", "Kavindu Perera", "SE202", "DS-2024-B1", "DSA1", "Data Structures and Algorithm", 88.0, 90.0, 92.0);
            saveSample("ST008", "Nuwan Pradeep", "SE202", "DS-2024-B1", "DSA1", "Data Structures and Algorithm", 78.0, 81.0, 85.0);
            saveSample("ST010", "Dilshan Madushanka", "SE202", "DS-2024-B1", "DSA1", "Data Structures and Algorithm", 72.0, 70.0, 79.0);

            performanceService.rebuildAVLTree();
            System.out.println("Sample student performance records seeded & AVL Tree self-balanced successfully!");
        }
    }

    private void saveSample(String stdId, String stdName, String cCode, String bCode, String mCode, String mName, double assign, double exam, double att) {
        StudentPerformance sp = new StudentPerformance();
        sp.setStudentId(stdId);
        sp.setStudentName(stdName);
        sp.setCourseCode(cCode);
        sp.setBatchCode(bCode);
        sp.setModuleCode(mCode);
        sp.setModuleName(mName);
        sp.setAssignmentMarks(assign);
        sp.setExamMarks(exam);
        sp.setAttendancePercentage(att);
        performanceService.savePerformance(sp);
    }
}
