package com.ltw.shorten_link.auth.payload;

import com.ltw.shorten_link.user.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private User data;
}
