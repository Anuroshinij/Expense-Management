package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ApiResponse;
import com.example.backend.service.SalaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    // ➕ Add / Update salary
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> setSalary(
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam Double amount) {

        return ResponseEntity.ok(
                salaryService.setSalary(month, year, amount));
    }

    // 📥 Get salary
    @GetMapping
    public ResponseEntity<ApiResponse<Double>> getSalary(
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                salaryService.getSalaryResponse(month, year));
    }
}