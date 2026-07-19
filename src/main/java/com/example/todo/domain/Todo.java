package com.example.todo.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private LocalDate date;
    private boolean completed;

    @Builder
    public Todo(String content, LocalDate date) {
        this.content = content;
        this.date = date;
        this.completed = false;
    }

    public void updateStatus(boolean completed){
        this.completed = completed;
    }
}
