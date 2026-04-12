package com.example.backend.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExpenseResponse {

    private LocalDate date;
    private Double total;
    private Map<String, List<ExpenseItem>> categories;

}
