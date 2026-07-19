package com.example.todo.dto;

import com.example.todo.domain.Todo;
import lombok.Getter;

import java.time.LocalDate;

//응답용
@Getter
public class TodoResponseDto {
    private Long id;
    private String content;
    private LocalDate date;
    private boolean completed;

    public TodoResponseDto(Todo todo){
        this.id = todo.getId();
        this.content = todo.getContent();
        this.date = todo.getDate();
        this.completed = todo.isCompleted();
    }
}
