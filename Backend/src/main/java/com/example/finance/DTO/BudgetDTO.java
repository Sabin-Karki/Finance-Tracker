package com.example.finance.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetDTO {
    private String name;
    private BigDecimal amount;
    private String category;
    private BigDecimal spent; // Optional for creation, required for updates
}

