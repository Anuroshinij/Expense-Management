package com.example.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.CategoryRequest;
import com.example.backend.model.Category;
import com.example.backend.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> create(
            @Valid @RequestBody CategoryRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.<List<Category>>builder()
                        .success(true)
                        .message("Categories fetched")
                        .data(categoryService.getCategories())
                        .build());
    }
}