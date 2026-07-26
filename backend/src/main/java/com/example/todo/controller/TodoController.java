package com.example.todo.controller;

import com.example.todo.dto.TodoRequestDto;
import com.example.todo.dto.TodoResponseDto;
import com.example.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoService todoService;

    @PostMapping
    public Long createTodo(@Valid @RequestBody TodoRequestDto dto, @AuthenticationPrincipal UserDetails userDetails){
        String loginId = userDetails.getUsername();
        return todoService.saveWithLoginId(dto,loginId);
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

    /**
     * 🔐 [QueryDSL + JWT 완벽 보안 버전] 할 일 동적 필터링 검색 API
     * 호출 URL: GET http://localhost:8080/api/todos/search?isCompleted=false&keyword=독학
     */
    @GetMapping("/search")
    public List<TodoResponseDto> searchTodos(
            @AuthenticationPrincipal UserDetails userDetails, // 시큐리티 인증 객체
            @RequestParam(required = false) Boolean isCompleted,
            @RequestParam(required = false) String keyword
    ) {
        // 필터에서 주입했던 문자열 아이디를 안전하게 추출합니다.
        String loginId = userDetails.getUsername();

        // 방금 만든 문자열 전용 서비스 로직으로 토스합니다!
        return todoService.searchTodosByLoginId(loginId, isCompleted, keyword);
    }

    /**
     * 🔒 [보안 고도화 버전] 내 할 일 목록 전체 조회
     * 호출 URL: GET http://localhost:8080/api/todos/my
     */
    @GetMapping("/my")
    public List<TodoResponseDto> getMyTodos(@AuthenticationPrincipal UserDetails userDetails) {
        String loginId = userDetails.getUsername();
        return todoService.findByLoginId(loginId);
    }
}
