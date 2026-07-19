package com.example.todo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

//요청용
@Getter
@NoArgsConstructor
public class TodoRequestDto {
    @NotBlank(message = "할 일 내용은 비어있을 수 없습니다.")
    private String content;

    @NotNull(message = "목표 날짜는 필수 있니다.")
    private LocalDate date;

    @NotNull(message = "유저 ID는 필수입니다.")
    private Long userId;
}
