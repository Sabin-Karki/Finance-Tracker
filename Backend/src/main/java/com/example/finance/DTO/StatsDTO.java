package com.example.finance.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StatsDTO {
    private  Integer totalAmount;
    private LocalDate date;

}
