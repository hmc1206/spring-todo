package com.example.todo.controller;

import com.example.todo.dto.UserRequestDto;
import com.example.todo.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    // 💡 [!] 아까 구글 Cloud 콘솔에서 발급받은 '내 클라이언트 ID' 문자열을 여기에 정확히 붙여넣으세요.
    private final String GOOGLE_CLIENT_ID = "381220738369-vt4ro1vba2j0i41svlangn9l8nn3k91m.apps.googleusercontent.com";

    /**
     * 🚀 프론트엔드로부터 구글 ID 토큰을 넘겨받아 검증 및 로그인 처리하는 API
     * 호출 URL: POST http://localhost:8080/api/auth/google
     */
    @PostMapping("/google")
    public ResponseEntity<Map<String, String>> googleLogin(@RequestBody Map<String, String> request) {
        String idTokenString = request.get("token"); // 프론트엔드가 바디에 실어 보낸 구글 토큰 추출

        // 💡 [테스트용 임시 코드] 포스트맨으로 "test"라고 보내면 구글 검증을 패스하고 바로 로그인 처리시킵니다.
        if ("test".equals(idTokenString)) {
            String jwtToken = userService.googleLoginOrSignup("test_user@gmail.com", "테스트유저");
            return ResponseEntity.ok(Map.of("accessToken", jwtToken));
        }

        try {
            // 1. [공식 가이드 적용] 구글 토큰 검증기 생성
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            // 2. 전달받은 토큰 문자열 검증 실행
            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                // 3. 진짜 구글 토큰임이 확인되면 사용자의 이메일과 이름을 안전하게 추출합니다.
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                // 4. 아까 완성한 UserService의 소셜 로그인 비즈니스 로직으로 전달하여 우리 서비스의 JWT 토큰 획득
                String jwtToken = userService.googleLoginOrSignup(email, name);

                // 5. 프론트엔드가 가로챌 수 있도록 JSON 바디에 이쁘게 담아 응답 보냅니다.
                return ResponseEntity.ok(Map.of("accessToken", jwtToken));
            } else {
                throw new IllegalArgumentException("유효하지 않은 구글 토큰 인증 실패");
            }

        } catch (Exception e) {
            // 토큰이 위조되었거나 만료되었을 때 에러 처리
            return ResponseEntity.status(401).body(Map.of("error", "구글 인증 실패: " + e.getMessage()));
        }
    }
}
