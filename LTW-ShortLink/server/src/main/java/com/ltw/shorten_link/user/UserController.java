package com.ltw.shorten_link.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ltw.shorten_link.auth.JwtUserDetails;
import com.ltw.shorten_link.shared.Pagination;

import jakarta.validation.Valid;

@RestController
@RequestMapping("user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("profile")
    public User profile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.getOne(((JwtUserDetails) authentication.getPrincipal()).getUsername());
    }

    @PostMapping("all")
    public Pagination<User> getMany(@Valid @RequestBody Pagination<User> body) {
        return userService.getMany(body);
    }

    @GetMapping("{username}")
    public User getOne(@PathVariable String username) {
        return userService.getOne(username);
    }
}
