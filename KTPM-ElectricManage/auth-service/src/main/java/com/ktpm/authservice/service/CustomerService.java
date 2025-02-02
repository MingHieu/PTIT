package com.ktpm.authservice.service;

import com.ktpm.authservice.mapper.UserMapper;
import com.ktpm.authservice.model.User;
import com.ktpm.authservice.repository.UserRepository;
import com.ktpm.authservice.vo.enums.Role;
import com.ktpm.authservice.vo.request.CustomerEditRequest;
import com.ktpm.authservice.vo.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    public List<UserResponse> getAllCustomer() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).filter(u -> u.getRole().equals(Role.CUSTOMER)).toList();
    }

    public List<UserResponse> getAllCustomer(List<Long> ids) {
        return userRepository.findAllById(ids).stream().map(userMapper::toUserResponse).filter(u -> u.getRole().equals(Role.CUSTOMER)).toList();
    }

    public Object editCustomer(CustomerEditRequest request) {
        User user = userRepository.findById(request.getId()).orElseThrow();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(user);
        return true;
    }

}
