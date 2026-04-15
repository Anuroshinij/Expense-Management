package com.example.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ExpenseItem;
import com.example.backend.dto.ExpenseRequest;
import com.example.backend.dto.ExpenseResponse;
import com.example.backend.exception.CustomException;
import com.example.backend.model.Category;
import com.example.backend.model.Expense;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    private User getCurrentUser() {
        String email = SecurityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found"));
    }

    public ApiResponse<Void> addExpense(ExpenseRequest request) {

        User user = getCurrentUser();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CustomException("Category not found"));

        Expense expense = Expense.builder()
                .date(request.getDate())
                .category(category)
                .amount(request.getAmount())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        expenseRepository.save(expense);

        return ApiResponse.<Void>builder()
                .message("Expense added successfully")
                .data(null)
                .success(true)
                .build();

    }

    public ApiResponse<ExpenseResponse> getExpenseByDate(LocalDate date) {

        User user = getCurrentUser();

        List<Expense> expenses = expenseRepository.findByUserAndDate(user, date);

        double total = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        Map<String, List<ExpenseItem>> grouped = expenses.stream()
                .collect(Collectors.groupingBy(
                        exp -> exp.getCategory() != null
                                ? exp.getCategory().getName()
                                : "UNCATEGORIZED",
                        TreeMap::new,
                        Collectors.mapping(exp -> ExpenseItem.builder()
                                .id(exp.getId())
                                .amount(exp.getAmount())
                                .description(exp.getDescription())
                                .build(),
                                Collectors.toList())));

        ExpenseResponse response = ExpenseResponse.builder()
                .date(date)
                .total(total)
                .categories(grouped)
                .build();

        return ApiResponse.<ExpenseResponse>builder()
                .message("Expenses retrieved successfully")
                .data(response)
                .success(true)
                .build();
    }

    public ApiResponse<Void> updateExpense(Long id, ExpenseRequest request) {

        User user = getCurrentUser();

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new CustomException("Expense not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CustomException("Category not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new CustomException("Unauthorized access");
        }

        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());

        expenseRepository.save(expense);

        return ApiResponse.<Void>builder()
                .message("Expense updated successfully")
                .data(null)
                .success(true)
                .build();

    }

    public ApiResponse<Void> deleteExpense(Long id) {

        User user = getCurrentUser();

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new CustomException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new CustomException("Unauthorized access");
        }

        expenseRepository.delete(expense);

        return ApiResponse.<Void>builder()
                .message("Expense deleted successfully")
                .data(null)
                .success(true)
                .build();

    }

}
