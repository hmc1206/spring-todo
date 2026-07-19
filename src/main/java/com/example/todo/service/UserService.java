package com.example.todo.service;

import com.example.todo.domain.User;
import com.example.todo.dto.UserRequestDto;
import com.example.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public Long signup(UserRequestDto dto){
        User user = User.builder()
                .loginId(dto.getLoginId())
                .password(dto.getPassword())
                .nickname(dto.getNickname())
                .build();
        return userRepository.save(user).getId();
    }
}
