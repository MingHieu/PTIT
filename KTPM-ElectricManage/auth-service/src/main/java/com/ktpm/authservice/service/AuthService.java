package com.ktpm.authservice.service;

import com.ktpm.authservice.mapper.UserMapper;
import com.ktpm.authservice.model.Customer;
import com.ktpm.authservice.model.Employee;
import com.ktpm.authservice.model.User;
import com.ktpm.authservice.repository.CustomerRepository;
import com.ktpm.authservice.repository.EmployeeRepository;
import com.ktpm.authservice.repository.UserRepository;
import com.ktpm.authservice.vo.enums.Role;
import com.ktpm.authservice.vo.request.RegisterRequest;
import com.ktpm.authservice.vo.response.AuthResponse;
import com.ktpm.authservice.vo.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final EmployeeRepository employeeRepository;

    private final CustomerRepository customerRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final UserMapper userMapper;

    public AuthResponse login(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.map(user -> AuthResponse.builder()
                .user(userMapper.toUserResponse(user))
                .token(jwtService.generateToken(user))
                .build()).orElse(null);
    }

    public UserResponse saveUser(RegisterRequest request) {
        User user = request.getUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        if (user.getRole().equals(Role.ADMIN)) {
            Employee employee = request.getEmployee();
            employee.setUserId(savedUser.getId());
            employeeRepository.save(employee);
        }

        if (user.getRole().equals(Role.CUSTOMER)) {
            Customer customer = request.getCustomer();
            customer.setUserId(savedUser.getId());
            customerRepository.save(customer);
        }

        return userMapper.toUserResponse(savedUser);
    }

}
