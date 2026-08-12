package com.example.backend.service;

import com.example.backend.dto.SignUpRequest;
import com.example.backend.dto.UserDto;
import com.example.backend.model.Batch;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.BatchRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<UserDto> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    public UserDto createUser(SignUpRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("User with email '" + normalizedEmail + "' already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(normalizedEmail);
        String rawPassword = (request.getPassword() != null && !request.getPassword().trim().isEmpty()) 
                ? request.getPassword() : "defaultpassword123";
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(request.getRole() != null ? request.getRole() : Role.LECTURER);
        user.setDepartment(request.getDepartment());
        user.setStaffOrStudentId(request.getStaffOrStudentId());
        user.setBatchId(request.getBatchId());
        user.setBatchCode(request.getBatchCode());
        if (request.getAssignedBatchIds() != null) user.setAssignedBatchIds(request.getAssignedBatchIds());
        if (request.getAssignedBatchCodes() != null) user.setAssignedBatchCodes(request.getAssignedBatchCodes());

        User saved = userRepository.save(user);
        return new UserDto(saved);
    }

    public UserDto updateUser(String id, SignUpRequest request) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (request.getEmail() != null && !request.getEmail().trim().equalsIgnoreCase(existing.getEmail())) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("User with email '" + newEmail + "' already exists");
            }
            existing.setEmail(newEmail);
        }

        if (request.getName() != null) existing.setName(request.getName());
        if (request.getDepartment() != null) existing.setDepartment(request.getDepartment());
        if (request.getStaffOrStudentId() != null) existing.setStaffOrStudentId(request.getStaffOrStudentId());
        if (request.getBatchId() != null) existing.setBatchId(request.getBatchId());
        if (request.getBatchCode() != null) existing.setBatchCode(request.getBatchCode());

        if (request.getAssignedBatchIds() != null) {
            existing.setAssignedBatchIds(request.getAssignedBatchIds());
            existing.setAssignedBatchCodes(request.getAssignedBatchCodes());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updated = userRepository.save(existing);
        return new UserDto(updated);
    }

    public UserDto assignBatchesToLecturer(String lecturerId, List<String> batchIds) {
        User lecturer = userRepository.findById(lecturerId)
                .orElseThrow(() -> new IllegalArgumentException("Lecturer not found with id: " + lecturerId));

        if (lecturer.getRole() != Role.LECTURER) {
            throw new IllegalArgumentException("Target user is not a Lecturer");
        }

        List<String> assignedIds = new ArrayList<>();
        List<String> assignedCodes = new ArrayList<>();

        if (batchIds != null) {
            for (String bId : batchIds) {
                Optional<Batch> batchOpt = batchRepository.findById(bId);
                if (batchOpt.isPresent()) {
                    Batch b = batchOpt.get();
                    assignedIds.add(b.getId());
                    assignedCodes.add(b.getBatchCode());
                }
            }
        }

        lecturer.setAssignedBatchIds(assignedIds);
        lecturer.setAssignedBatchCodes(assignedCodes);

        User saved = userRepository.save(lecturer);
        return new UserDto(saved);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
