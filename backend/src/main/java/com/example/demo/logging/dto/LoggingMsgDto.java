package com.example.demo.logging.dto;

import lombok.Data;

@Data
public class LoggingMsgDto {
    int level;
    String message;
    String fileName;
    int lineNumber;
    int columnNumber;
    Object[] additional;
}
