package com.example.todo.repository;

import com.example.todo.domain.Todo;

import java.util.List;

public interface TodoRepositoryCustom {
    List<Todo> searchTodos(Long userId, Boolean isCompleted, String keyword);
}
