package com.example.backend.seeder;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@scholastic.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            System.out.println("=================================================");
            System.out.println("No Admin account found in database. Seeding default Admin...");

            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("adminpassword123"));
            admin.setRole(Role.ADMIN);
            admin.setDepartment("Academic Administration");
            admin.setStaffOrStudentId("ADM001");

            User saved = userRepository.save(admin);
            System.out.println("Default Admin account created successfully! MongoDB ID: " + saved.getId());
            System.out.println("Admin Email    : " + adminEmail);
            System.out.println("Admin Password : adminpassword123");
            System.out.println("Admin Role     : ADMIN");
            System.out.println("=================================================");
        } else {
            System.out.println("Admin account (" + adminEmail + ") already exists in MongoDB. Skipping seeding.");
        }
    }
}
