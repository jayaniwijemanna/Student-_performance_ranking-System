package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.SignInRequest;
import com.example.backend.dto.SignUpRequest;
import com.example.backend.dto.UserDto;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public AuthResponse registerUser(SignUpRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.error("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().length() < 6) {
            return AuthResponse.error("Password must be at least 6 characters");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            return AuthResponse.error("User with this email already exists");
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.LECTURER;
        if (userRole == Role.ADMIN) {
            return AuthResponse.error("Admin registration is restricted. Please sign in using the seeded System Administrator account.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setDepartment(request.getDepartment() != null ? request.getDepartment() : "General Academic");
        user.setStaffOrStudentId(request.getStaffOrStudentId());

        User savedUser = userRepository.save(user);
        String mockToken = "scholastic-token-" + UUID.randomUUID().toString();

        return AuthResponse.success("User registered successfully", mockToken, new UserDto(savedUser));
    }

    public AuthResponse authenticateUser(SignInRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return AuthResponse.error("Email and password are required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Optional<User> userOptional = userRepository.findByEmail(normalizedEmail);

        if (userOptional.isEmpty()) {
            return AuthResponse.error("Invalid email or password");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.error("Invalid email or password");
        }

        String mockToken = "scholastic-token-" + UUID.randomUUID().toString();
        return AuthResponse.success("Authentication successful", mockToken, new UserDto(user));
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
}
