package com.example.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class CheckController {

    @GetMapping("/public")
    public String publicApi() {
        return "Public API working";
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user")
    public String userApi(Authentication authentication) {
        return "Hello User: " + authentication.getName();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminApi(Authentication authentication) {
        return "Hello Admin: " + authentication.getName();
    }
}