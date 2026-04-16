package com.example.backend.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.CategoryRequest;
import com.example.backend.dto.CategoryResponse;
import com.example.backend.exception.CustomException;
import com.example.backend.model.Category;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;

        public ApiResponse<Void> createCategory(CategoryRequest request) {

                log.info("Create category request received");

                String email = SecurityContextHolder.getContext()
                                .getAuthentication()
                                .getName();

                log.debug("Fetching user for email : {}", email);

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new CustomException("User not found"));

                String categoryName = request.getName().trim().toUpperCase();

                log.debug("Checking duplicate category : {} for user : {}", categoryName, email);

                categoryRepository.findByNameAndUser(categoryName, user)
                                .ifPresent(c -> {
                                        log.warn("Duplicate category attempt: {} for user: {}", categoryName, email);
                                        throw new CustomException("Category already exists");
                                });

                Category category = Category.builder()
                                .name(categoryName)
                                .user(user)
                                .build();

                categoryRepository.save(category);

                log.warn("Duplicate category attempt: {} for user: {}", categoryName, email);

                return ApiResponse.<Void>builder()
                                .message("Category created successfully")
                                .success(true)
                                .data(null)
                                .build();
        }

        public ApiResponse<List<CategoryResponse>> getCategories() {

                log.info("Fetching categories");

                String email = SecurityContextHolder.getContext()
                                .getAuthentication()
                                .getName();

                log.debug("Fetching user for email: {}", email);

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> {
                                        log.error("User not found for email: {}", email);
                                        return new CustomException("User not found");
                                });

                List<CategoryResponse> categories = categoryRepository.findByUser(user)
                                .stream()
                                .map(category -> CategoryResponse.builder()
                                                .id(category.getId())
                                                .name(category.getName())
                                                .build())
                                .toList();

                log.info("Fetched {} categories for user: {}", categories.size(), email);

                return ApiResponse.<List<CategoryResponse>>builder()
                                .success(true)
                                .message("Categories fetched successfully")
                                .data(categories)
                                .build();
        }
}
