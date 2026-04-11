package com.example.backend.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey123";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    //change to User user and extract from there
    public String generateToken(String email, String role) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("role",role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();

    }

    public String extractRole(String token) {
        return extractClaims(token).get("role",String.class);

    }

    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }

    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
