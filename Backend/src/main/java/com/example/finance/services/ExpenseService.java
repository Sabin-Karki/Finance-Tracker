package com.example.finance.services;

import com.example.finance.DTO.ExpenseDTO;
import com.example.finance.DTO.ExpenseStatsDTO;
import com.example.finance.entity.Expense;
import com.example.finance.entity.User;

import java.util.List;

public interface ExpenseService {
    Expense postExpense(ExpenseDTO expenseDTO, User user);
    List<Expense> getAllExpenses(User user);
    Expense getExpenseById(Long id, User user);
    Expense updateExpense(Long id, ExpenseDTO expenseDTO, User user);
    void deleteExpense(Long id, User user);
    List<ExpenseStatsDTO> getExpenseStatsData(User user);
}