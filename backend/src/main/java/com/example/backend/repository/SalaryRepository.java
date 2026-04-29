package com.example.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Salary;

public interface SalaryRepository extends JpaRepository<Salary, Long> {

    Optional<Salary> findByUserIdAndMonthAndYear(Long userId, int month, int year);

}
