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
@Transactional(readOnly = true) // 💡 [실무 최적화] 모든 조회 메서드의 기본 성능 향상
public class TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    @Transactional // 💡 쓰기 작업은 덮어쓰기 필수
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

    public List<TodoResponseDto> findByUserId(Long userId){
        return todoRepository.findByUserId(userId).stream()
                .map(TodoResponseDto::new)
                .toList();
    }

    /**
     * 🔐 [QueryDSL + JWT 인증 연동] 문자열 로그인 아이디 기반 동적 필터링 검색
     */
    public List<TodoResponseDto> searchTodosByLoginId(String loginId, Boolean isCompleted, String keyword) {
        // 1. 토큰에서 추출한 문자열 아이디로 진짜 유저 엔티티를 찾습니다.
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않은 유저입니다."));

        // 2. 찾아온 유저의 진짜 고유 숫자 번호(user.getId())를 꺼내어 QueryDSL 리포지토리를 호출합니다.
        return todoRepository.searchTodos(user.getId(), isCompleted, keyword).stream()
                .map(TodoResponseDto::new)
                .toList();
    }

    /**
     * 🔒 [보안 고도화] 문자열 로그인 아이디 기반 내 할 일 전체 조회
     */
    public List<TodoResponseDto> findByLoginId(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않은 유저입니다."));

        return todoRepository.findByUserId(user.getId()).stream()
                .map(TodoResponseDto::new)
                .toList();
    }

    @Transactional // 💡 쓰기 작업
    public void updateStatus(Long id, boolean completed){
        Todo todo = todoRepository.findById(id).orElseThrow();
        todo.updateStatus(completed);
    }

    @Transactional // 💡 쓰기 작업 누락 보완
    public void delete(Long id) {
        todoRepository.deleteById(id);
    }
}
