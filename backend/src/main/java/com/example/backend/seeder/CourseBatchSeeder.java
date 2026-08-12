package com.example.backend.seeder;

import com.example.backend.model.Batch;
import com.example.backend.model.Course;
import com.example.backend.repository.BatchRepository;
import com.example.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CourseBatchSeeder implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Override
    public void run(String... args) throws Exception {
        if (courseRepository.count() == 0) {
            System.out.println("Seeding default courses and batches into MongoDB...");

            Course cs = new Course("CS101", "BSc (Hons) in Computer Science", "Computing", 120, "Core undergraduate computer science program.");
            Course se = new Course("SE202", "BSc (Hons) in Software Engineering", "Computing", 120, "Specialized software engineering and system design program.");
            Course ds = new Course("DS303", "BSc (Hons) in Data Science & AI", "Computing", 120, "Advanced data science, machine learning, and analytics.");

            Course savedCs = courseRepository.save(cs);
            Course savedSe = courseRepository.save(se);
            Course savedDs = courseRepository.save(ds);

            Batch b1 = new Batch(savedSe.getId(), savedSe.getCode(), "SE-2024-B1", "Software Engineering 2024 - Batch 1", "2024/2025", "Semester 1", "ACTIVE");
            Batch b2 = new Batch(savedSe.getId(), savedSe.getCode(), "SE-2024-B2", "Software Engineering 2024 - Batch 2", "2024/2025", "Semester 1", "ACTIVE");
            Batch b3 = new Batch(savedCs.getId(), savedCs.getCode(), "CS-2024-B1", "Computer Science 2024 - Batch 1", "2024/2025", "Semester 1", "ACTIVE");
            Batch b4 = new Batch(savedDs.getId(), savedDs.getCode(), "DS-2024-B1", "Data Science 2024 - Batch 1", "2024/2025", "Semester 1", "ACTIVE");

            batchRepository.save(b1);
            batchRepository.save(b2);
            batchRepository.save(b3);
            batchRepository.save(b4);

            System.out.println("Default courses and batches seeded successfully!");
        }
    }
}
