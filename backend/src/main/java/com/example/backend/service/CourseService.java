package com.example.backend.service;

import com.example.backend.model.Course;
import com.example.backend.repository.BatchRepository;
import com.example.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private BatchRepository batchRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        if (course.getCode() != null) {
            course.setCode(course.getCode().trim().toUpperCase());
        }
        if (courseRepository.existsByCode(course.getCode())) {
            throw new IllegalArgumentException("Course with code '" + course.getCode() + "' already exists");
        }
        return courseRepository.save(course);
    }

    public Course updateCourse(String id, Course updatedCourse) {
        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + id));

        if (updatedCourse.getCode() != null && !updatedCourse.getCode().trim().equalsIgnoreCase(existing.getCode())) {
            String newCode = updatedCourse.getCode().trim().toUpperCase();
            if (courseRepository.existsByCode(newCode)) {
                throw new IllegalArgumentException("Course with code '" + newCode + "' already exists");
            }
            existing.setCode(newCode);
        }

        existing.setName(updatedCourse.getName());
        existing.setDepartment(updatedCourse.getDepartment());
        existing.setCredits(updatedCourse.getCredits());
        existing.setDescription(updatedCourse.getDescription());

        return courseRepository.save(existing);
    }

    public void deleteCourse(String id) {
        if (!courseRepository.existsById(id)) {
            throw new IllegalArgumentException("Course not found with id: " + id);
        }
        // Delete cascading batches associated with this course
        batchRepository.deleteByCourseId(id);
        courseRepository.deleteById(id);
    }
}
