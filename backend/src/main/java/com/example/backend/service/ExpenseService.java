package com.example.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ExpenseItem;
import com.example.backend.dto.ExpenseRequest;
import com.example.backend.dto.ExpenseResponse;
import com.example.backend.exception.CustomException;
import com.example.backend.model.Expense;
import com.example.backend.model.User;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ApiResponse addExpense(ExpenseRequest request) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new CustomException("User not found"));

        Expense expense = Expense.builder()
                                .date(request.getDate())
                                .category(request.getCategory())
                                .amount(request.getAmount())
                                .description(request.getDescription())
                                .createdAt(LocalDateTime.now())
                                .user(user)
                                .build();

        expenseRepository.save(expense);

        return ApiResponse.builder()
                        .message("Expense added successfully")
                        .data(null)
                        .build();
        
    }

    public ExpenseResponse getExpenseByDate(LocalDate date) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new CustomException("User not found"));

        List<Expense> expenses = expenseRepository.findByUserAndDate(user, date);

        double total = expenses.stream()
                            .mapToDouble(Expense::getAmount)
                            .sum();

        Map<String, List<ExpenseItem>> grouped = expenses.stream()
                                                    .collect(Collectors.groupingBy(
                                                        Expense::getCategory,
                                                        Collectors.mapping(exp -> ExpenseItem.builder()
                                                                                        .id(exp.getId())
                                                                                        .amount(exp.getAmount())
                                                                                        .description(exp.getDescription())
                                                                                        .build(),
                                                                                        Collectors.toList())
                                                    ));
        
        return ExpenseResponse.builder()
                            .date(date)
                            .total(total)
                            .categories(grouped)
                            .build();

    }

    public ApiResponse updateExpense(Long id, ExpenseRequest request) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new CustomException("User not found"));

        Expense expense = expenseRepository.findById(id)
                                        .orElseThrow(() -> new CustomException("Expense not found"));

        if(!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());

        expenseRepository.save(expense);

        return ApiResponse.builder()
                        .message("Expense updated successfully")
                        .data(null)
                        .build();

    }


    public ApiResponse deleteExpense(Long id) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new CustomException("User not found"));

        Expense expense = expenseRepository.findById(id)
                                        .orElseThrow(() -> new CustomException("Exception not found"));

        if(!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");        
        }

        expenseRepository.delete(expense);

        return ApiResponse.builder()
                        .message("Expense deleted successfully")
                        .data(null)
                        .build();
        
    }
    

}
