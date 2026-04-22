package com.example.backend.dto;

import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DailyReportItem {
    private LocalDate date;
    private Double total;
}