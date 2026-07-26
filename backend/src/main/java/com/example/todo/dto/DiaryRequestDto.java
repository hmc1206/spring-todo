package com.example.todo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

//요청용
@Getter
@NoArgsConstructor
public class DiaryRequestDto {
    @NotBlank(message = "제목을 입력해주세요")
    private String title;
    @NotBlank(message = "내용은 비어있을 수 없습니다.")
    private String content;
    @NotNull(message = "다이어리 날짜는 필수 있니다.")
    private LocalDate date;
    private String emotion;
}
