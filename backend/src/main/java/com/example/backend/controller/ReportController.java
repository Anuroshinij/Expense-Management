package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/weekly")
    public List<DailyReportItem> weekly(@RequestParam LocalDate startDate) {
        return reportService.getWeeklyReport(startDate);
    }

    @GetMapping("/monthly")
    public List<DailyReportItem> monthly(
            @RequestParam int month,
            @RequestParam int year) {

        return reportService.getMonthlyReport(month, year);
    }

    @GetMapping("/category")
    public List<CategoryReportItem> category(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {

        return reportService.getCategoryReport(start, end);
    }
}