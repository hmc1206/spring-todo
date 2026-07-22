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
                //브라우저의 CORS 검문을 통과시키기 위한 허용 설정
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();

                    // 1. 데이터 요청을 허락할 프론트엔드 주소(Vite 리액트 기본 주소)를 정확히 지정합니다.
                    config.setAllowedOrigins(java.util.List.of("http://localhost:5173"));

                    // 2. 프론트엔드가 보낼 수 있는 HTTP 메서드(CRUD) 종류를 허용합니다.
                    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

                    // 3. 어떤 헤더(예: Content-Type, Authorization 등)를 실어 보내든 모두 허용합니다.
                    config.setAllowedHeaders(java.util.List.of("*"));

                    // 4. 아주 중요! 쿠키나 JWT 인증 헤더(Authorization)를 통신에 주고받을 수 있도록 허용합니다.
                    config.setAllowCredentials(true);

                    return config;
                }))
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
