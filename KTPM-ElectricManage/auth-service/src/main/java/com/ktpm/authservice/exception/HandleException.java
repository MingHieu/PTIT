package com.ktpm.authservice.exception;

import com.ktpm.authservice.vo.ExceptionVO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.sql.SQLException;

@ControllerAdvice
public class HandleException {

    @ExceptionHandler(value = {SQLException.class})
    public ResponseEntity<ExceptionVO> handleSQLException(Exception ex, WebRequest request) {
        return new ResponseEntity<>(
                ExceptionVO.builder()
                        .statusCode(HttpStatus.FORBIDDEN.value())
                        .message(ex.getMessage())
                        .build(),
                new HttpHeaders(),
                HttpStatus.FORBIDDEN);
    }

}
