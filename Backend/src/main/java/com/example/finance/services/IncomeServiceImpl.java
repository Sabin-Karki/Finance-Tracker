package com.example.finance.services;

import com.example.finance.DTO.IncomeDTO;
import com.example.finance.DTO.StatsDTO;
import com.example.finance.entity.Income;
import com.example.finance.entity.User;
import com.example.finance.repository.IncomeRepository;
import com.example.finance.services.IncomeService;
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
public class IncomeServiceImpl implements  IncomeService{

    private final IncomeRepository incomeRepository;

    public Income postIncome(IncomeDTO incomeDTO, User user) {
        Income income = new Income();
        income.setTitle(incomeDTO.getTitle());
        income.setAmount(incomeDTO.getAmount());
        income.setDate(incomeDTO.getDate());
        income.setCategory(incomeDTO.getCategory());
        income.setDescription(incomeDTO.getDescription());
        income.setUser(user);
        return incomeRepository.save(income);
    }

    public List<Income> getAllIncome(User user) {
        return incomeRepository.findByUser(user);
    }

    public Income getIncomeById(Long id, User user) {
        return incomeRepository.findById(id)
                .filter(income -> income.getUser().equals(user))
                .orElseThrow(() -> new EntityNotFoundException("Income not found"));
    }

    public Income updateIncome(Long id, IncomeDTO incomeDTO, User user) {
        Income income = getIncomeById(id, user);
        income.setTitle(incomeDTO.getTitle());
        income.setAmount(incomeDTO.getAmount());
        income.setDate(incomeDTO.getDate());
        income.setCategory(incomeDTO.getCategory());
        income.setDescription(incomeDTO.getDescription());
        return incomeRepository.save(income);
    }

    public void deleteIncome(Long id, User user) {
        Income income = getIncomeById(id, user);
        incomeRepository.delete(income);
    }
    public List<StatsDTO> getIncomeChartData(User user) {
        List<Income> incomes = incomeRepository.findByUser(user);

        // Create a map to store the total income amount for each date
        Map<LocalDate, Integer> totalIncomeByDate = new HashMap<>();

        for (Income income : incomes) {
            // Sum the income amounts for the same date
            totalIncomeByDate.merge(income.getDate(), income.getAmount(), Integer::sum);
        }

        // Convert the map to a list of StatsDTO objects
        List<StatsDTO> chartData = totalIncomeByDate.entrySet().stream()
                .map(entry -> {
                    StatsDTO dto = new StatsDTO();
                    dto.setDate(entry.getKey());
                    dto.setTotalAmount(entry.getValue()); // Total amount for that date
                    return dto;
                })
                .collect(Collectors.toList());

        return chartData;
    }
    }


