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
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    @Transactional
    public Long save(DiaryRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
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
}
