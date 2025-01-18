package com.example.finance.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data

public class ExpenseStatsDTO {
Integer totalAmount;
LocalDate date;
}
