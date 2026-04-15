package com.example.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ExpenseRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amont must be greater than zero")
    private Double amount;
    
    private String description;

}
