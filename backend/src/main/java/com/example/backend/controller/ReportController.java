package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.ReportService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<List<DailyReportItem>>> weekly(
            @RequestParam LocalDate startDate) {

        return ResponseEntity.ok(
                reportService.getWeeklyReport(startDate));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<DailyReportItem>>> monthly(
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                reportService.getMonthlyReport(month, year));
    }

    @GetMapping("/category")
    public ResponseEntity<ApiResponse<List<CategoryReportItem>>> category(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {

        return ResponseEntity.ok(
                reportService.getCategoryReport(start, end));
    }
}