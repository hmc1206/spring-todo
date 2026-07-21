package com.example.todo.repository;

import com.example.todo.domain.Diary;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;

import static com.example.todo.domain.QDiary.diary;

@RequiredArgsConstructor
public class DiaryRepositoryImpl implements DiaryRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Diary> searchDiaries(Long userId, LocalDate date, String keyword) {
        return queryFactory
                .selectFrom(diary)
                .where(
                        diary.user.id.eq(userId),
                        eqDate(date),
                        containKeyword(keyword)
                )
                .fetch();
    }

    private BooleanExpression eqDate(LocalDate date) {
        return date != null ? diary.date.eq(date) : null;
    }

    private BooleanExpression containKeyword(String keyword) {
        // 글자가 있으면 diary.content.contains(keyword) 리턴
        return StringUtils.hasText(keyword) ? diary.content.contains(keyword) : null;
    }
}
