package com.example.finance.repository;

import com.example.finance.entity.Budget;
import com.example.finance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
    List<Budget> findByCategory(String category);

}
