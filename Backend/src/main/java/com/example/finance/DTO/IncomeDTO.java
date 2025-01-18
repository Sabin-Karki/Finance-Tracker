package com.example.finance.DTO;

import lombok.Data;
import org.springframework.lang.NonNull;

import java.time.LocalDate;

@Data
public class IncomeDTO {
    private Long id;

    @NonNull
    private String title;

    @NonNull
    private Integer amount;

    @NonNull
    private LocalDate date;

    @NonNull
    private String category;

    private String description; // Optional field
}