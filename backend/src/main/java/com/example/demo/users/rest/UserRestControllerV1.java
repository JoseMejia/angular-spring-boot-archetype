package com.example.demo.users.rest;

import com.example.demo.users.dto.UserDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/v1.0")
public class UserRestControllerV1 {

    @GetMapping
    public HttpEntity<UserDto> getUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var username = authentication.getName();
        var roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        var userDto = UserDto.builder()
                .name(username)
                .roles(roles)
                .build();
        return ResponseEntity.ok(userDto);
    }
}
