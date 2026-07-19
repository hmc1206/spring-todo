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
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private LocalDate date;
    private String emotion;

    @Builder
    public Diary(String title, String content, LocalDate date, String emotion){
        this.title = title;
        this.content = content;
        this.date = date;
        this.emotion = emotion;
    }

    public void update(String title, String content, String emotion){
        this.title = title;
        this.content = content;
        this.emotion = emotion;
    }
}
