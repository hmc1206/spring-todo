package com.example.todo.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuerydslConfig {
    // 스프링이 자동으로 JPA 엔티티 매니저를 주입함
    @PersistenceContext
    private EntityManager em;

    @Bean
    public JPAQueryFactory jpaQueryFactory(){
        // JPAQueryFactory를 스프링 빈으로 등록
        return new JPAQueryFactory(em);
    }
}
