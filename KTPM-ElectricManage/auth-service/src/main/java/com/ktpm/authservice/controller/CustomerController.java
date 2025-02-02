package com.ktpm.authservice.controller;

import com.ktpm.authservice.service.CustomerService;
import com.ktpm.authservice.vo.request.CustomerEditRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/all")
    public Object getAllCustomer(@RequestParam(required = false) List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            return customerService.getAllCustomer(ids);
        } else {
            return customerService.getAllCustomer();
        }
    }

    @PostMapping("/edit")
    public Object editCustomer(@RequestBody CustomerEditRequest request) {
        return customerService.editCustomer(request);
    }

}
