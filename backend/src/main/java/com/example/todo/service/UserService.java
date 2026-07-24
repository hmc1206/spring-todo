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
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional // 쓰기 작업 포함되므로 트랜잭션 선언
    public String googleLoginOrSignup(String email, String name) {
        // 1. 구글 이메일(loginId)로 이미 가입된 회원인지 확인합니다.
        User user = userRepository.findByLoginId(email)
                // 2. 만약 가입되지 않은 신규 유저라면 즉시 자동 회원가입(DB 저장)을 진행합니다.
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .loginId(email)
                                .nickname(name)
                                .build()
                ));

        // 3. 회원가입 혹은 로그인이 완료된 유저의 이메일을 기반으로 '우리 서비스 전용 JWT 토큰'을 발행하여 반환합니다.
        return jwtTokenProvider.createToken(user.getLoginId());
    }
}
