package com.ktpm.workflowservice.vo;

import com.ktpm.workflowservice.vo.enums.Role;
import lombok.Data;

@Data
public class Customer {

    private Long id;

    private String username;

    private Role role;

    private String name;

    private String email;

    private String phoneNumber;

}
