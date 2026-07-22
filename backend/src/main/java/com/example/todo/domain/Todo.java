package com.example.todo.domain;

import jakarta.persistence.*;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") //여기가 FK 컬럼명
    private User user;

    @Builder
    public Todo(String content, LocalDate date, User user) {
        this.content = content;
        this.date = date;
        this.completed = false;
        this.user = user;
    }

    public void updateStatus(boolean completed){
        this.completed = completed;
    }
}
