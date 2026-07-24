package com.example.todo.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //구글 이메일 고유 식별자로 사용함
    @Column(unique = true, nullable = false)
    private String loginId;
    //비밀번호 X
    private String nickname;

    @Builder
    public User(String loginId, String nickname){
        this.loginId = loginId;
        this.nickname = nickname;
    }
}
