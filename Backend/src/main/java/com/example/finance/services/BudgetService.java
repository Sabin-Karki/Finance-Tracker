package com.example.finance.services;

import com.example.finance.DTO.BudgetDTO;
import com.example.finance.DTO.BudgetStatsDTO;
import com.example.finance.entity.Budget;
import com.example.finance.entity.User;
import com.example.finance.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public Budget createBudget(BudgetDTO dto, User user) {
        Budget budget = new Budget();
        budget.setName(dto.getName());
        budget.setAmount(dto.getAmount());
        budget.setCategory(dto.getCategory());
        budget.setSpent(dto.getSpent() != null ? dto.getSpent() : BigDecimal.ZERO);
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    public Budget updateBudget(Long id, BudgetDTO dto, User user) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().equals(user)) {
            throw new RuntimeException("Access denied");
        }
        budget.setName(dto.getName());
        budget.setAmount(dto.getAmount());
        budget.setCategory(dto.getCategory());
        budget.setSpent(dto.getSpent() != null ? dto.getSpent() : budget.getSpent());
        return budgetRepository.save(budget);
    }

    public List<Budget> getAllBudgets(User user) {
        return budgetRepository.findAll().stream()
                .filter(budget -> budget.getUser().equals(user))
                .collect(Collectors.toList());
    }

    public Budget getBudgetById(Long id, User user) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().equals(user)) {
            throw new RuntimeException("Access denied");
        }
        return budget;
    }

    public void deleteBudget(Long id, User user) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().equals(user)) {
            throw new RuntimeException("Access denied");
        }
        budgetRepository.delete(budget);
    }
    public Budget findByCategory(String category){
        return budgetRepository.findByCategory(category).get(0);
    }
    public List<BudgetStatsDTO> getBudgetStatsData(User user){
        List<Budget> budgets = budgetRepository.findByUser(user);
        Map<String,BigDecimal> totalSpentByCategory = new HashMap<>();

        for(Budget budget : budgets){
            String category = budget.getCategory();
            BigDecimal spent = budget.getSpent();
            totalSpentByCategory.merge(category,spent,BigDecimal::add);
        }
        List<BudgetStatsDTO> statsData = totalSpentByCategory.entrySet().stream()
                .map(entry->{
                    BudgetStatsDTO dto = new BudgetStatsDTO();
                    dto.setCategory(entry.getKey());
                    dto.setSpent(entry.getValue());
                    return dto;
                })
                .collect(Collectors.toList());
        return statsData;
    }
}
