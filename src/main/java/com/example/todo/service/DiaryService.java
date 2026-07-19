package com.example.todo.service;

import com.example.todo.domain.Diary;
import com.example.todo.dto.DiaryRequestDto;
import com.example.todo.dto.DiaryResponseDto;
import com.example.todo.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryRepository diaryRepository;

    public Long save(DiaryRequestDto dto) {
        Diary diary = Diary.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .date(dto.getDate())
                .emotion(dto.getEmotion())
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
