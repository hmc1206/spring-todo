package com.example.todo.service;

import com.example.todo.config.JwtTokenProvider;
import com.example.todo.domain.User;
import com.example.todo.dto.UserRequestDto;
import com.example.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public Long signup(UserRequestDto dto){
        //비밀번호를 암호화애서 저장
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .loginId(dto.getLoginId())
                .password(encodedPassword)
                .nickname(dto.getNickname())
                .build();

        return userRepository.save(user).getId();
    }

    @Transactional(readOnly = true)
    public String login(UserRequestDto dto) {
        User user = userRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 잘못되었습니다"));

        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("아이디 또는 비밀번호가 잘못되었습니다.");
        }

        return jwtTokenProvider.createToken(user.getLoginId());
    }
}
