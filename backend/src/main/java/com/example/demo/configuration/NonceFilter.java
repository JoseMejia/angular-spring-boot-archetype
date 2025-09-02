package com.example.demo.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

public class NonceFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        if ("/".equals(request.getServletPath())) {
            String nonce = generateNonce();
            response.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'nonce-"+nonce+"'; script-src 'self' 'nonce-"+nonce+"';");
            Cookie newCookie = new Cookie("CSP-NONCE", nonce);
            newCookie.setHttpOnly(false);
            response.addCookie(newCookie);
        }

        filterChain.doFilter(request, response);
    }

    private String generateNonce() {
        return UUID.randomUUID().toString();
    }
}