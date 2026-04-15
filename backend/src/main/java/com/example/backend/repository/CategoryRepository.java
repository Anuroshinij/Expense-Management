package com.example.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Category;
import com.example.backend.model.User;
import java.util.List;


public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameAndUser(String name, User user);

    List<Category> findByUser(User user);

}
