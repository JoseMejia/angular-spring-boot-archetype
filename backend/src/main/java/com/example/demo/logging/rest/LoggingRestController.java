package com.example.demo.logging.rest;

import com.example.demo.logging.dto.LoggingMsgDto;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.event.Level;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/logs/v1")
@Slf4j
public class LoggingRestController {

    // from NgxLoggerLevel in ngx-logger
    private static final Map<Integer, String> LEVEL_MAP = Map.of(
            0, "TRACE",
            1, "DEBUG",
            2, "INFO",
            3, "LOG",
            4, "WARN",
            5, "ERROR",
            6, "FATAL",
            7, "OFF"
    );

    @PostMapping
    public void log(@RequestBody LoggingMsgDto payload) {
        if (7 == payload.getLevel()) {
            return; // OFF
        }
        if (3 == payload.getLevel()) {
            log.info("{}", payload); // LOG as INFO
            return;
        }
        try {
            // to avoid potential exception from valueOf
            var level = Level.valueOf(LEVEL_MAP.get(payload.getLevel()));
            log.atLevel(level).log("{}", payload);
        } catch (IllegalArgumentException e) {
            log.warn("Unknown log level: {}, message: {}", payload.getLevel(), payload);
        }
    }
}
