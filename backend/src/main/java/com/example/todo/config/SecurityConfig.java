package com.example.todo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration      //이 클래스는 스프링의 환경설정 파일임을 선언함
@EnableWebSecurity  //스프링 시큐리티를 활성화하고 내 커스텀 설정을 적용하겠다는 뜻
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider; // 💡 토큰 무기 주입

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/signup", "/api/users/login", "/error").permitAll()
                        .anyRequest().authenticated()
                )
                // 💡 [핵심 코드 추가!] 시큐리티의 기본 필터(UsernamePasswordAuthenticationFilter)가
                // 작동하기 직전에, 우리가 만든 커스텀 'JwtAuthenticationFilter'를 먼저 거치도록 셋팅합니다.
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
