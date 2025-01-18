package com.example.finance.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetStatsDTO {
String category;
BigDecimal spent;
}
