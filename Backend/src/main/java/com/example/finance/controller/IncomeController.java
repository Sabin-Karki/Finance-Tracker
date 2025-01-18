package com.example.finance.controller;

import com.example.finance.DTO.IncomeDTO;
import com.example.finance.DTO.StatsDTO;
import com.example.finance.entity.Income;
import com.example.finance.entity.User;
import com.example.finance.services.IncomeService;
import com.example.finance.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {
    private final IncomeService incomeService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Income> postIncome(@RequestBody IncomeDTO incomeDTO, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        Income income = incomeService.postIncome(incomeDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(income);
    }

    @GetMapping
    public ResponseEntity<List<Income>> getAllIncome(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        List<Income> incomes = incomeService.getAllIncome(user);
        return ResponseEntity.ok(incomes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Income> getIncomeById(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            Income income = incomeService.getIncomeById(id, user);
            return ResponseEntity.ok(income);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long id, @RequestBody IncomeDTO incomeDTO, Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            Income updatedIncome = incomeService.updateIncome(id, incomeDTO, user);
            return ResponseEntity.ok(updatedIncome);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            incomeService.deleteIncome(id, user);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/chart-data")
    public ResponseEntity<List<StatsDTO>> getIncomeChartData(Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            List<StatsDTO> chartData = incomeService.getIncomeChartData(user);
            return ResponseEntity.ok(chartData);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}