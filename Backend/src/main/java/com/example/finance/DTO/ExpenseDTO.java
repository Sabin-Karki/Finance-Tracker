package com.example.finance.DTO;

import lombok.Data;
import org.springframework.lang.NonNull;

import java.time.LocalDate;

@Data
public class ExpenseDTO {
    private Long id;

    @NonNull
    private String title;

    private String description;

    @NonNull
    private String category;

    @NonNull
    private LocalDate date;

    @NonNull
    private Integer amount;
}
