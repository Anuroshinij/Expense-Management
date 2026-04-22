package com.example.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.model.Expense;
import com.example.backend.model.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserAndDate(User user, LocalDate date);

    // ✅ DAILY TOTALS
    @Query("SELECT e.date, SUM(e.amount) " +
           "FROM Expense e " +
           "WHERE e.user = :user AND e.date BETWEEN :start AND :end " +
           "GROUP BY e.date " +
           "ORDER BY e.date")
    List<Object[]> getDailyTotals(
            @Param("user") User user,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    // ✅ FIXED CATEGORY QUERY (IMPORTANT)
    @Query("SELECT c.name, SUM(e.amount) " +
           "FROM Expense e " +
           "JOIN e.category c " +
           "WHERE e.user = :user AND e.date BETWEEN :start AND :end " +
           "GROUP BY c.name " +
           "ORDER BY SUM(e.amount) DESC")
    List<Object[]> getCategoryTotals(
            @Param("user") User user,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}