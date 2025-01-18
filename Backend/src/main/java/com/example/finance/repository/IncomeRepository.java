package com.example.finance.repository;

import com.example.finance.entity.Income;
import com.example.finance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByCategory(String category);
    List<Income> findByAmount(Integer amount);
    List<Income> findByDate(LocalDate date);
    List<Income> findByUser(User user); // New method to find incomes by user
}