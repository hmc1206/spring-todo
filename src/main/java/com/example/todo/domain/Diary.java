package com.example.todo.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private LocalDate date;
    private String emotion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder
    public Diary(String title, String content, LocalDate date, String emotion, User user){
        this.title = title;
        this.content = content;
        this.date = date;
        this.emotion = emotion;
        this.user = user;
    }

    public void update(String title, String content, String emotion){
        this.title = title;
        this.content = content;
        this.emotion = emotion;
    }
}
