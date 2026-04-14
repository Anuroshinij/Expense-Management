package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.model.User;
import com.example.backend.exception.CustomException;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

        private final ExpenseRepository expenseRepository;
        private final UserRepository userRepository;

        private User getCurrentUser() {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new CustomException("User not found"));
        }

        public ApiResponse<List<DailyReportItem>> getWeeklyReport(LocalDate startDate) {

                User user = getCurrentUser();
                LocalDate endDate = startDate.plusDays(6);

                List<Object[]> results = expenseRepository.getDailyTotals(user, startDate, endDate);

                List<DailyReportItem> data = results.stream()
                                .map(obj -> DailyReportItem.builder()
                                                .date((LocalDate) obj[0])
                                                .total(obj[1] != null ? (Double) obj[1] : 0.0)
                                                .build())
                                .collect(Collectors.toList());

                return ApiResponse.<List<DailyReportItem>>builder()
                                .message("Weekly report fetched successfully")
                                .data(data)
                                .success(true)
                                .build();
        }

        public ApiResponse<List<DailyReportItem>> getMonthlyReport(int month, int year) {

                User user = getCurrentUser();

                LocalDate start = LocalDate.of(year, month, 1);
                LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

                List<Object[]> results = expenseRepository.getDailyTotals(user, start, end);

                List<DailyReportItem> data = results.stream()
                                .map(obj -> DailyReportItem.builder()
                                                .date((LocalDate) obj[0])
                                                .total(obj[1] != null ? (Double) obj[1] : 0.0)
                                                .build())
                                .collect(Collectors.toList());

                return ApiResponse.<List<DailyReportItem>>builder()
                                .message("Monthly report fetched successfully")
                                .data(data)
                                .success(true)
                                .build();
        }

        public ApiResponse<List<CategoryReportItem>> getCategoryReport(LocalDate start, LocalDate end) {

                User user = getCurrentUser();

                List<Object[]> results = expenseRepository.getCategoryTotals(user, start, end);

                List<CategoryReportItem> data = results.stream()
                                .map(obj -> CategoryReportItem.builder()
                                                .category((String) obj[0])
                                                .total(obj[1] != null ? (Double) obj[1] : 0.0)
                                                .build())
                                .collect(Collectors.toList());

                return ApiResponse.<List<CategoryReportItem>>builder()
                                .message("Category report fetched successfully")
                                .data(data)
                                .success(true)
                                .build();
        }
}