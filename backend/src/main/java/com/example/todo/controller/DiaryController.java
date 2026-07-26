package com.example.todo.controller;

import com.example.todo.dto.DiaryRequestDto;
import com.example.todo.dto.DiaryResponseDto;
import com.example.todo.service.DiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController//json 데이터를 주고받는 백엔드 전용 주소창임을 선언
@RequiredArgsConstructor
@RequestMapping("/api/diaries")
public class DiaryController {
    private final DiaryService diaryService;

    @PostMapping
    public Long createDiary(@Valid @RequestBody DiaryRequestDto dto, @AuthenticationPrincipal UserDetails userDetails) {
        String loginId = userDetails.getUsername();
        return diaryService.saveWithLoginId(dto,loginId);
    }

    @GetMapping
    public List<DiaryResponseDto> getAllDiary() {
        return diaryService.findAll();
    }

    @GetMapping("/date")
    public List<DiaryResponseDto> getByDate(@RequestParam LocalDate date){
        return diaryService.findByDate(date);
    }

    /**
     * 🔐 [QueryDSL + JWT 인증] 다이어리 복합 동적 필터링 검색 API
     * 호출 예시: GET http://localhost:8080/api/diaries/search?date=2026-07-20&keyword=일기
     */
    @GetMapping("/search")
    public List<DiaryResponseDto> searchDiaries(
            @AuthenticationPrincipal UserDetails userDetails, // 시큐리티 인증 객체 가로채기
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, // 날짜 형식 포맷팅
            @RequestParam(required = false) String keyword
    ) {
        // 토큰에서 검증된 유저의 문자열 로그인 아이디 추출
        String loginId = userDetails.getUsername();

        // 우리가 완성한 문자열 기반 다이어리 검색 서비스 로직 호출!
        return diaryService.searchDiariesByLoginId(loginId, date, keyword);
    }

    /**
     * 🔒 [보안 고도화] 내 다이어리 목록 전체 조회
     * 호출 예시: GET http://localhost:8080/api/diaries/my
     */
    @GetMapping("/my")
    public List<DiaryResponseDto> getMyDiaries(@AuthenticationPrincipal UserDetails userDetails) {
        String loginId = userDetails.getUsername();
        return diaryService.findByLoginId(loginId);
    }
}
