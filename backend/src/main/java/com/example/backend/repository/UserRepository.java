package com.example.backend.repository;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query(value = "{ 'staffOrStudentId': ?0 }", exists = true)
    boolean existsByStaffOrStudentId(String staffOrStudentId);

    @Query("{ 'staffOrStudentId': ?0 }")
    Optional<User> findByStaffOrStudentId(String staffOrStudentId);

    boolean existsByRole(Role role);

    List<User> findByRole(Role role);
}
