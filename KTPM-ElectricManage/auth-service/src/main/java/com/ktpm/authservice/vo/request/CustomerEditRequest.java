package com.ktpm.authservice.vo.request;

import lombok.Data;

@Data
public class CustomerEditRequest {

    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

}
