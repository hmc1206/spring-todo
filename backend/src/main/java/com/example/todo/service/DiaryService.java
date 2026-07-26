package com.example.todo.service;

import com.example.todo.domain.Diary;
import com.example.todo.domain.User;
import com.example.todo.dto.DiaryRequestDto;
import com.example.todo.dto.DiaryResponseDto;
import com.example.todo.repository.DiaryRepository;
import com.example.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 💡 [실무 최적화] 기본 조회 성능 향상 활성화
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    @Transactional // 💡 DB 쓰기 작업이므로 덮어쓰기 선언
    public Long saveWithLoginId(DiaryRequestDto dto, String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        Diary diary = Diary.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .date(dto.getDate())
                .emotion(dto.getEmotion())
                .user(user)
                .build();
        return diaryRepository.save(diary).getId();
    }

    public List<DiaryResponseDto> findAll() {
        return diaryRepository.findAll().stream()
                .map(DiaryResponseDto::new)
                .toList();
    }

    public List<DiaryResponseDto> findByDate(LocalDate date){
        return diaryRepository.findByDate(date).stream()
                .map(DiaryResponseDto::new)
                .toList();
    }

    /**
     * 🔐 [QueryDSL + JWT 인증 연동] 문자열 로그인 아이디 기반 다이어리 동적 검색
     */
    public List<DiaryResponseDto> searchDiariesByLoginId(String loginId, LocalDate date, String keyword) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        return diaryRepository.searchDiaries(user.getId(), date, keyword).stream()
                .map(DiaryResponseDto::new)
                .toList();
    }

    /**
     * 🔒 [보안 고도화] 문자열 로그인 아이디 기반 내 다이어리 전체 조회
     */
    public List<DiaryResponseDto> findByLoginId(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않은 유저입니다."));

        return diaryRepository.findByUserId(user.getId()).stream()
                .map(DiaryResponseDto::new)
                .toList();
    }
}
