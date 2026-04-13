package com.example.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Expense;
import com.example.backend.model.User;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserAndDate(User user, LocalDate date);

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

    @Query("SELECT e.category, SUM(e.amount) " +
           "FROM Expense e " +
           "WHERE e.user = :user AND e.date BETWEEN :start AND :end " +
           "GROUP BY e.category")
    List<Object[]> getCategoryTotals(
            @Param("user") User user,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

}
