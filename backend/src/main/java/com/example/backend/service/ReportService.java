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

    private com.example.backend.model.User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found"));
    }

    public List<DailyReportItem> getWeeklyReport(LocalDate startDate) {

        User user = getCurrentUser();
        LocalDate endDate = startDate.plusDays(6);

        List<Object[]> results = expenseRepository.getDailyTotals(user, startDate, endDate);

        return results.stream()
                .map(obj -> DailyReportItem.builder()
                        .date((LocalDate) obj[0])
                        .total((Double) obj[1])
                        .build())
                .collect(Collectors.toList());
    }


    public List<DailyReportItem> getMonthlyReport(int month, int year) {

        User user = getCurrentUser();

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Object[]> results = expenseRepository.getDailyTotals(user, start, end);

        return results.stream()
                .map(obj -> DailyReportItem.builder()
                        .date((LocalDate) obj[0])
                        .total((Double) obj[1])
                        .build())
                .collect(Collectors.toList());
    }


    public List<CategoryReportItem> getCategoryReport(LocalDate start, LocalDate end) {

        User user = getCurrentUser();

        List<Object[]> results = expenseRepository.getCategoryTotals(user, start, end);

        return results.stream()
                .map(obj -> CategoryReportItem.builder()
                        .category((String) obj[0])
                        .total((Double) obj[1])
                        .build())
                .collect(Collectors.toList());
    }
}