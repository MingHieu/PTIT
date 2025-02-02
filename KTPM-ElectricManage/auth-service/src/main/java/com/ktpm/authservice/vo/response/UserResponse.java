package com.ktpm.authservice.vo.response;

import com.ktpm.authservice.vo.enums.Role;
import lombok.Data;

@Data
public class UserResponse {

    private Long id;

    private String username;

    private Role role;

    private String name;

    private String email;

    private String phoneNumber;

}
