package com.example.todo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component // 이 클래스를 관리하는 컴포넌트로 등록함
public class JwtTokenProvider {
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private final long tokenValidityInMilliseconds = 3600000;

    //로그인을 성공한 유저에게 줄 jwt 토큰 생성 메서드
    public String createToken(String loginid){
        Claims claims = Jwts.claims().setSubject(loginid); //토큰 배게에 유저 아이디를 다음
        Date now = new Date();
        Date validity = new Date(now.getTime() + tokenValidityInMilliseconds);
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)       //토큰 발행 시간
                .setExpiration(validity)//토큰 만료 시간
                .signWith(key)          //내 비밀키로 암호화
                .compact();             //최종 문자열로 압축해서 리턴
    }

    //사용자가 보낸 토큰에서 유저 아이디를 꺼내는 메서드
    public String getLoginId(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key) //내 비밀키을 대조해 봄
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); //토큰 안에 숨겨진 유저 아이디를 꺼냄
    }

    //사용자가 들고 온 토큰이 가짜인지 만료됐는지 검증하는 메서드
    public boolean validateToken(String token){
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true; //도장이 일치하고 시간이 남으면 통과
        } catch (Exception e){
            return false;
        }
    }
}
