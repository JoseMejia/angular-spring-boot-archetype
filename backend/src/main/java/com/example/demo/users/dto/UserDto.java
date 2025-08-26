package com.example.demo.users.dto;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class UserDto {
    String name;
    List<String> roles;
}
