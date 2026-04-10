package com.example.backend.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.exception.CustomException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    private static final String ADMIN_SECRET = "SECRET123";

    public ApiResponse register(RegisterRequest request) {

        if(!request.getPassword().equals(request.getConfirmPassword())) {
            throw new CustomException("Passwords do not match");
        }

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already exists");
        }

        Role role = Role.USER;

        if(request.getAdminSecret() != null && 
                request.getAdminSecret().equals(ADMIN_SECRET)) {
                    role = Role.ADMIN;
                }
        
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return ApiResponse.builder()
                .message("User registered successfully")
                .data(null)
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new CustomException("User not found"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid password");
        }

        return AuthResponse.builder()
                .message("Login successful")
                .token("TEMP_TOKEN")
                .role(user.getRole().name())
                .build();
    }

}
