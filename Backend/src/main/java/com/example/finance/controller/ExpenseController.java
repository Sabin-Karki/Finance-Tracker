package com.example.finance.controller;

import com.example.finance.DTO.ExpenseDTO;
import com.example.finance.DTO.ExpenseStatsDTO;
import com.example.finance.entity.Expense;
import com.example.finance.entity.User;
import com.example.finance.services.ExpenseService;
import com.example.finance.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expense")
@RequiredArgsConstructor

public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Expense> postExpense(@RequestBody ExpenseDTO dto, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        Expense createdExpense = expenseService.postExpense(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Expense>> getAllExpenses(Authentication authentication) {
        User user =  userService.findByUsername(authentication.getName());
        List<Expense> expenses = expenseService.getAllExpenses(user);
        return ResponseEntity.ok(expenses);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            return ResponseEntity.ok(expenseService.getExpenseById(id, user));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id,@RequestBody ExpenseDTO dto,Authentication authentication) {
        try {
            User user =  userService.findByUsername(authentication.getName());
            return ResponseEntity.ok(expenseService.updateExpense(id, dto, user));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            expenseService.deleteExpense(id, user);
            return ResponseEntity.ok(null);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("expense-stats")
    public ResponseEntity<List<ExpenseStatsDTO>> getExpenseStatsData(Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            List<ExpenseStatsDTO> chartExpenses = expenseService.getExpenseStatsData(user);
            return ResponseEntity.ok(chartExpenses);

        } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}