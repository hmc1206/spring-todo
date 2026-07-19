package com.example.todo.service;

import com.example.todo.domain.Todo;
import com.example.todo.domain.User;
import com.example.todo.dto.TodoRequestDto;
import com.example.todo.dto.TodoResponseDto;
import com.example.todo.repository.TodoRepository;
import com.example.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public Long save(TodoRequestDto dto){
        //1. dto에 담긴 userId로 진짜 회원 엔티티를 찾음
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않은 유저입니다."));

        Todo todo = Todo.builder()
                .content(dto.getContent())
                .date(dto.getDate())
                .user(user)
                .build();
        return todoRepository.save(todo).getId();
    }

    public List<TodoResponseDto> findAll() {
        return todoRepository.findAll().stream()
                .map(TodoResponseDto::new)
                .toList();
    }

    public List<TodoResponseDto> findByDate(LocalDate date){
        return todoRepository.findByDate(date).stream()
                .map(TodoResponseDto::new)
                .toList();
    }

    @Transactional
    public void updateStatus(Long id, boolean completed){
        Todo todo = todoRepository.findById(id).orElseThrow();
        todo.updateStatus(completed);
    }

    public void delete(Long id) {
        todoRepository.deleteById(id);
    }
}
