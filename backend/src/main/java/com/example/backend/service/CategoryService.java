package com.example.backend.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.CategoryRequest;
import com.example.backend.model.Category;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;

        public ApiResponse<Void> createCategory(CategoryRequest request) {

                String email = SecurityContextHolder.getContext()
                                .getAuthentication()
                                .getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String categoryName = request.getName().trim().toUpperCase();

                categoryRepository.findByNameAndUser(categoryName, user)
                                .ifPresent(c -> {
                                        throw new RuntimeException("Category already exists");
                                });

                Category category = Category.builder()
                                .name(categoryName)
                                .user(user)
                                .build();

                categoryRepository.save(category); 

                return ApiResponse.<Void>builder()
                                .message("Category created successfully")
                                .success(true)
                                .build();
        }

        public List<Category> getCategories() {

                String email = SecurityContextHolder.getContext()
                                .getAuthentication()
                                .getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return categoryRepository.findByUser(user);
        }
}
