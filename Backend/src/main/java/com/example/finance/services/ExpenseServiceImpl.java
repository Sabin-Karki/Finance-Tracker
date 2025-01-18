package com.example.finance.services;

import com.example.finance.DTO.ExpenseDTO;
import com.example.finance.DTO.ExpenseStatsDTO;
import com.example.finance.entity.Expense;
import com.example.finance.entity.User;
import com.example.finance.repository.ExpenseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;



    public Expense postExpense(ExpenseDTO expenseDTO, User user) {
        Expense expense = new Expense();
        expense.setTitle(expenseDTO.getTitle());
        expense.setDate(expenseDTO.getDate());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());
        expense.setDescription(expenseDTO.getDescription());
        expense.setUser(user);
        return expenseRepository.save(expense);
    }


    public List<Expense> getAllExpenses(User user) {
        return expenseRepository.findByUser(user);
    }


    public Expense getExpenseById(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Expense not found with id " + id));
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User not authorized to view this expense");
        }
        return expense;
    }


    public Expense updateExpense(Long id, ExpenseDTO expenseDTO, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Expense not found with id " + id));
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User not authorized to update this expense");
        }
        expense.setTitle(expenseDTO.getTitle());
        expense.setDate(expenseDTO.getDate());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());
        expense.setDescription(expenseDTO.getDescription());
        return expenseRepository.save(expense);
    }


    public void deleteExpense(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Expense not found with id " + id));
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User not authorized to delete this expense");
        }
        expenseRepository.delete(expense);
    }
   public  List<ExpenseStatsDTO> getExpenseStatsData(User user){
        List<Expense> expenses = expenseRepository.findByUser(user);//retreives expense record from specific user
        Map<LocalDate,Integer> totalExpenseByDate = new HashMap<>();
             for(Expense expense:expenses){
               totalExpenseByDate.merge(expense.getDate(),expense.getAmount(),Integer::sum);
             }
       List<ExpenseStatsDTO> statsData =  totalExpenseByDate.entrySet().stream()
               .map(entry -> {
                   ExpenseStatsDTO dto = new ExpenseStatsDTO();
                   dto.setDate(entry.getKey());
                   dto.setTotalAmount(entry.getValue()); // Total amount for that date
                   return dto;
               })
               .collect(Collectors.toList());

       return statsData;
   }
}