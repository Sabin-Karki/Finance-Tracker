package com.example.finance;

import com.example.finance.config.SecurityConfig;
import com.example.finance.security.JwtAuthenticationFilter;
import com.example.finance.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinanceTrackerApplication {

	@Autowired
	public FinanceTrackerApplication(SecurityConfig securityConfig, JwtAuthenticationFilter jwtAuthenticationFilter, UserService userService) {
		securityConfig.setUserService(userService);
		jwtAuthenticationFilter.setUserService(userService);
	}

	public static void main(String[] args) {
		SpringApplication.run(FinanceTrackerApplication.class, args);
	}
}