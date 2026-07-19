package com.example.todo.repository;

import com.example.todo.domain.Diary;
import com.example.todo.domain.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByDate(LocalDate date);
}
