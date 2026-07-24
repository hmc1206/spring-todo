package com.example.todo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    // 💡 [피드백] 이제 소셜 로그인 단일 체계이므로 패스워드를 암호화하던
    // BCryptPasswordEncoder 빈(Bean)은 필요가 없어 완전히 제거했습니다. 코드가 더욱 깔끔해집니다.

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 💡 1. [CORS 설정 정밀 조율] 리액트(5173 포트)와의 안전한 풀스택 통신 개방
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(java.util.List.of("http://localhost:5173")); // Vite 리액트 주소 완벽 일치
                    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(java.util.List.of("*"));
                    config.setAllowCredentials(true); // JWT 인증 헤더 허용 필수
                    return config;
                }))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 💡 2. [인가 정책 업데이트] 구글 인증 전용 주소 문 열어주기
                .authorizeHttpRequests(auth -> auth
                        // 기존 /api/users/** 경로를 폐기하고, 새로 만든 소셜 로그인 주소와 에러 페이지를 프리패스 목록에 등록합니다.
                        .requestMatchers("/api/users/google", "/error").permitAll()
                        // 그 외 할 일/다이어리 검색 등 모든 API는 우리가 만든 JwtAuthenticationFilter를 거쳐 인증되어야만 합니다.
                        .anyRequest().authenticated()
                )

                // 💡 3. JWT 검증 필터 위치 세팅
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
