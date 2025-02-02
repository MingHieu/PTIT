package com.ktpm.authservice.vo.request;

import com.ktpm.authservice.model.Customer;
import com.ktpm.authservice.model.Employee;
import com.ktpm.authservice.model.User;
import lombok.Data;

@Data
public class RegisterRequest {

    private User user;

    private Customer customer;

    private Employee employee;
}
