package com.ktpm.authservice.vo;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExceptionVO {

    private Integer statusCode;

    private String message;

}
