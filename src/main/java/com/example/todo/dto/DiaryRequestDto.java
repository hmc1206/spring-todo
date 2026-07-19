package com.example.todo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

//요청용
@Getter
@NoArgsConstructor
public class DiaryRequestDto {
    private String title;
    private String content;
    private LocalDate date;
    private String emotion;
}
