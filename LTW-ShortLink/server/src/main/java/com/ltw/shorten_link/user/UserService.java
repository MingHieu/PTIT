package com.ltw.shorten_link.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ltw.shorten_link.auth.JwtUserDetails;
import com.ltw.shorten_link.role.RoleRepository;
import com.ltw.shorten_link.shared.Pagination;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private PasswordEncoder passwordEncoder;

    public UserService(@Lazy PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new JwtUserDetails(user);
    }

    public void create(String username, String password) throws Exception {
        User existUser = userRepository.findByUsername(username);
        if (existUser != null) {
            throw new Exception("Tài khoản đã tồn tại");
        }
        User user = new User(username, this.passwordEncoder.encode(password));
        user.setRole(roleRepository.findByName("user"));
        userRepository.save(user);
    }

    public User getOne(String username) {
        User user = userRepository.findByUsername(username);
        return user;
    }

    public Pagination<User> getMany(Pagination<User> body) {
        List<User> users = userRepository.findAll(PageRequest.of(body.page, body.per_page)).getContent();
        body.setData(users);
        return body;
    }
}