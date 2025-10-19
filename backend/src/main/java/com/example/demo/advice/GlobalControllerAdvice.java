package com.example.demo.advice;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ControllerAdvice
class GlobalControllerAdvice {
    @ExceptionHandler(NoResourceFoundException.class)
    public String handleNotFound() {
        return "index.html";
    }
}