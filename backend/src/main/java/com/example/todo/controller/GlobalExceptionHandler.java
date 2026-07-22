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

    @org.springframework.web.bind.annotation.ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public org.springframework.http.ResponseEntity<com.example.todo.dto.ErrorResponse> handleValidationException(
            org.springframework.web.bind.MethodArgumentNotValidException e) {

        // 💡 여러 에러 중 첫 번째로 걸린 에러 메시지를 꺼내옵니다.
        // 우리가 DTO에 적었던 "할 일 내용은 비어있을 수 없습니다."라는 문장이 여기에 담깁니다.
        String errorMessage = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        // 400(Bad Request) 번호와 예쁜 에러 메시지를 가방에 담습니다.
        com.example.todo.dto.ErrorResponse errorResponse = new com.example.todo.dto.ErrorResponse(
                org.springframework.http.HttpStatus.BAD_REQUEST.value(),
                errorMessage
        );

        return new org.springframework.http.ResponseEntity<>(errorResponse, org.springframework.http.HttpStatus.BAD_REQUEST);
    }

}
