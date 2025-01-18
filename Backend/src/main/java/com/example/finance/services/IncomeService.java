package com.example.finance.services;

import com.example.finance.DTO.IncomeDTO;
import com.example.finance.DTO.StatsDTO;
import com.example.finance.entity.Income;
import com.example.finance.entity.User;

import java.util.List;

public interface IncomeService {
     Income postIncome(IncomeDTO incomeDTO, User user); // Accept user as parameter
     List<Income> getAllIncome(User user); // Accept user as parameter
    Income getIncomeById(Long id, User user); // Accept user as parameter
     Income updateIncome(Long id, IncomeDTO incomeDTO, User user); // Accept user as parameter
     void deleteIncome(Long id, User user); // Accept user as parameter
    List<StatsDTO>  getIncomeChartData(User user);

}