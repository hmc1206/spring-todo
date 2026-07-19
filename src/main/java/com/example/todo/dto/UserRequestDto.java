package com.example.todo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserRequestDto {
    private String loginId;
    private String password;
    private String nickname;
}
