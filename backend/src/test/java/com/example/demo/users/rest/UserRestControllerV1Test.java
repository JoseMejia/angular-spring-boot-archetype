package com.example.demo.users.rest;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserRestControllerV1Test {

    @BeforeEach
    void setUp() {
        SecurityContext emptyContext = SecurityContextHolder.createEmptyContext();
        emptyContext.setAuthentication(new UsernamePasswordAuthenticationToken(
                "testUser",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER"),
                        new SimpleGrantedAuthority("ROLE_ADMIN"))
        ));
        SecurityContextHolder.setContext(emptyContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testGetUser() {
        var controller = new UserRestControllerV1();
        var response = controller.getUser();
        var user = response.getBody();

        assertNotNull(user);
        assertEquals("testUser", user.getName());
        assertTrue(user.getRoles().contains("ROLE_USER"));
        assertTrue(user.getRoles().contains("ROLE_ADMIN"));
        assertEquals(2, user.getRoles().size());
    }

}