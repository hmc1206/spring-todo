package com.example.todo.repository;

import com.example.todo.domain.Diary;

import java.time.LocalDate;
import java.util.List;

public interface DiaryRepositoryCustom {
    // 유저 고유 ID(숫자), 선택적 날짜, 선택적 키워드로 일기를 검색하는 메서드 선언
    List<Diary> searchDiaries(Long userId, LocalDate date, String keyword);
}
