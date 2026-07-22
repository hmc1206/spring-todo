package com.example.todo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 비밀번호 암호화
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS 설정
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // React 프론트엔드 주소
        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        // 허용 HTTP 메서드
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        // 모든 요청 헤더 허용
        configuration.setAllowedHeaders(
                List.of("*")
        );

        // Authorization 응답 헤더 노출
        configuration.setExposedHeaders(
                List.of("Authorization")
        );

        // 쿠키 사용 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    /**
     * Spring Security 설정
     */
    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http
                // ⭐ CORS 활성화
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // CSRF 비활성화
                .csrf(csrf ->
                        csrf.disable()
                )

                // JWT Stateless 설정
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // URL 접근 권한 설정
                .authorizeHttpRequests(auth ->
                        auth

                                // CORS Preflight 요청 허용
                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()

                                // 회원가입 / 로그인 허용
                                .requestMatchers(
                                        "/api/users/signup",
                                        "/api/users/login",
                                        "/error"
                                )
                                .permitAll()

                                // 나머지 API는 인증 필요
                                .anyRequest()
                                .authenticated()
                )

                // JWT 인증 필터 등록
                .addFilterBefore(
                        new JwtAuthenticationFilter(
                                jwtTokenProvider
                        ),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}