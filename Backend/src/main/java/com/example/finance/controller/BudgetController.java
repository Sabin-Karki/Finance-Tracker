package com.example.finance.controller;

import com.example.finance.DTO.BudgetDTO;
import com.example.finance.DTO.BudgetStatsDTO;
import com.example.finance.entity.Budget;
import com.example.finance.entity.User;
import com.example.finance.services.BudgetService;
import com.example.finance.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor

public class BudgetController {

    private final BudgetService budgetService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody BudgetDTO dto, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        Budget createdBudget = budgetService.createBudget(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Budget>> getAllBudgets(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        List<Budget> budgets = budgetService.getAllBudgets(user);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            return ResponseEntity.ok(budgetService.getBudgetById(id, user));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @RequestBody BudgetDTO dto, Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            return ResponseEntity.ok(budgetService.updateBudget(id, dto, user));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            budgetService.deleteBudget(id, user);
            return ResponseEntity.ok(null);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/pie-data")
    public ResponseEntity<List<BudgetStatsDTO>> getBudgetStatsData(Authentication authentication){
        try {
        User user = userService.findByUsername(authentication.getName());
        List<BudgetStatsDTO> pieData = budgetService.getBudgetStatsData(user);
        return  ResponseEntity.ok(pieData);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
