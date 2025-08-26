package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class PasswordEncoderTest {

    @Test
    void testPasswordEncoder() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String result = encoder.encode("myPassword");
        System.out.println("encoded=" + result);
        assertTrue(encoder.matches("myPassword", result));
    }
}
