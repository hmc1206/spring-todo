package com.example.todo.dto;

import com.example.todo.domain.Diary;
import lombok.Getter;

import java.time.LocalDate;

//응답용
@Getter
public class DiaryResponseDto {
    private Long id;
    private String title;
    private String content;
    private LocalDate date;
    private String emotion;

    //엔티티를 DTO로 변환해주는 생성자
    public DiaryResponseDto(Diary diary){
        this.id = diary.getId();
        this.title = diary.getTitle();
        this.content = diary.getContent();
        this.date = diary.getDate();
        this.emotion = diary.getEmotion();
    }
}
