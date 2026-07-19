package com.example.todo.controller;

import com.example.todo.dto.TodoRequestDto;
import com.example.todo.dto.TodoResponseDto;
import com.example.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoService todoService;

    @PostMapping
    public Long createTodo(@Valid @RequestBody TodoRequestDto dto){
        return todoService.save(dto);
    }

    @GetMapping
    public List<TodoResponseDto> getAllTodos() {
        return todoService.findAll();
    }

    @GetMapping("/date")
    public List<TodoResponseDto> getTodosByDate(@RequestParam LocalDate date){
        return todoService.findByDate(date);
    }

    @PatchMapping("/{id}")
    public void updateStatus(@PathVariable Long id, @RequestParam boolean completed){
        todoService.updateStatus(id, completed);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id){
        todoService.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<TodoResponseDto> getTodoByUser(@PathVariable Long userId){
        //주소창의 {userId} 자리에 들어오는 숫자를 @PathVariable로 받아옴
        return todoService.findByUserId(userId);
    }
}
