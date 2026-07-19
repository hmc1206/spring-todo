package com.example.todo.controller;

import com.example.todo.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // 💡 모든 컨트롤러에서 터지는 에러를 JSON 데이터로 가로채겠다고 선언
public class GlobalExceptionHandler {

    // 💡 코드 실행 중 'IllegalArgumentException'이 발생하면 이 메서드가 즉시 가로챕니다.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {

        // 에러 가방에 404(Not Found) 번호와 서비스에서 던진 진짜 메시지(e.getMessage())를 담습니다.
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                e.getMessage()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
}
