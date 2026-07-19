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

    private String loginId;
    private String password;
    private String nickname;

    @Builder
    public User(String loginId, String password, String nickname){
        this.loginId = loginId;
        this.password = password;
        this.nickname = nickname;
    }
}
