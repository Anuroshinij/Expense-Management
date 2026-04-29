package com.example.backend.service;

import org.springframework.stereotype.Service;

import com.example.backend.dto.ApiResponse;
import com.example.backend.exception.CustomException;
import com.example.backend.model.Salary;
import com.example.backend.model.User;
import com.example.backend.repository.SalaryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found"));
    }

    public ApiResponse<Void> setSalary(int month, int year, Double amount) {

    User user = getCurrentUser();

    Salary salary = salaryRepository
            .findByUserIdAndMonthAndYear(user.getId(), month, year)
            .orElse(null);

    if (salary == null) {
        salary = Salary.builder()
                .month(month)
                .year(year)
                .user(user)
                .build();
    }

    salary.setAmount(amount);
    salaryRepository.save(salary);

    return ApiResponse.<Void>builder()
            .message("Salary saved successfully")
            .success(true)
            .build();
}

    public ApiResponse<Double> getSalaryResponse(int month, int year) {

    User user = getCurrentUser();

    Double amount = salaryRepository
            .findByUserIdAndMonthAndYear(user.getId(), month, year)
            .map(Salary::getAmount)
            .orElse(0.0);

    return ApiResponse.<Double>builder()
            .message("Salary fetched successfully")
            .data(amount)
            .success(true)
            .build();
}

}
