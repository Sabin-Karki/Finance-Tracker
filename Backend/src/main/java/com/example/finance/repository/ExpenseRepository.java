package com.example.finance.repository;

import com.example.finance.entity.Expense;
import com.example.finance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByDate(LocalDate date);
    List<Expense> findByCategory(String category);
    List<Expense> findByAmount(Integer amount);
    List<Expense> findByUser(User user); // New method to find expenses by user
}
