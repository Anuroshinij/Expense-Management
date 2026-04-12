package com.example.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ExpenseRequest;
import com.example.backend.dto.ExpenseResponse;
import com.example.backend.service.ExpenseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ApiResponse> addExpense(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                        .body(expenseService.addExpense(request));
    }

    @GetMapping
    public ResponseEntity<ExpenseResponse> getByDate(@RequestParam LocalDate date) {
        return ResponseEntity.ok(expenseService.getExpenseByDate(date));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateExpense(
                        @PathVariable Long id, 
                        @Valid @RequestBody ExpenseRequest request) {
        
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteExpense(@PathVariable Long id) {
            
        return ResponseEntity.ok(expenseService.deleteExpense(id));
    } 

}
