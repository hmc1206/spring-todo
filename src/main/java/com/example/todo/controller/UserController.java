package com.example.todo.controller;

import com.example.todo.dto.UserRequestDto;
import com.example.todo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public Long singup(@RequestBody UserRequestDto dto){
        return userService.signup(dto);
    }
}
