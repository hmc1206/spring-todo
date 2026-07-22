package com.example.todo.repository;

import com.example.todo.domain.Todo;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;

import java.util.List;
import static com.example.todo.domain.QTodo.todo;

@RequiredArgsConstructor
public class TodoRepositoryImpl implements TodoRepositoryCustom {

    private final JPAQueryFactory queryFactory; // [STEP 1]에서 등록한 빈이 주입됩니다.

    @Override
    public List<Todo> searchTodos(Long userId, Boolean isCompleted, String keyword) {
        return queryFactory
                .selectFrom(todo) // SELECT * FROM todo
                .where(
                        todo.user.id.eq(userId),   // WHERE user_id = :userId (기본 조건)
                        eqCompleted(isCompleted),  // 동적 조건 1
                        containKeyword(keyword)    // 동적 조건 2
                )
                .fetch(); // 쿼리 실행 후 리스트로 반환
    }

    // 완료 여부 필터링 조건 (null이면 이 조건은 무시됨)
    private BooleanExpression eqCompleted(Boolean isCompleted) {
        return isCompleted != null ? todo.completed.eq(isCompleted) : null;
    }

    // 키워드 포함 조건 (글자가 비어있거나 null이면 무시됨)
    private BooleanExpression containKeyword(String keyword) {
        return StringUtils.hasText(keyword) ? todo.content.contains(keyword) : null;
    }
}