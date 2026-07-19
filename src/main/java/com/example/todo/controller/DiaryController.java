package com.example.todo.controller;

import com.example.todo.dto.DiaryRequestDto;
import com.example.todo.dto.DiaryResponseDto;
import com.example.todo.service.DiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController//json 데이터를 주고받는 백엔드 전용 주소창임을 선언
@RequiredArgsConstructor
@RequestMapping("/api/diaries")
public class DiaryController {
    private final DiaryService diaryService;

    @PostMapping
    public Long createDiary(@Valid @RequestBody DiaryRequestDto dto) { return diaryService.save(dto);}

    @GetMapping
    public List<DiaryResponseDto> getAllDiary() {
        return diaryService.findAll();
    }

    @GetMapping("/date")
    public List<DiaryResponseDto> getByDate(@RequestParam LocalDate date){
        return diaryService.findByDate(date);
    }
}
