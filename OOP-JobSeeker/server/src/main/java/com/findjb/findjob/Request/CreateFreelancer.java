package com.findjb.findjob.Request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.findjb.findjob.Constraint.Unique;

import lombok.Data;

@Data
public class CreateFreelancer {
    @NotNull(message = "Tên không được để trống")
    @Size(max = 100, message = "Tên quá dài")
    private String name;
    @NotNull(message = "Email không được để trống")
    @Unique(message = "Email đã tồn tại")
    @Email(message = "Email không đúng định dạng")
    private String email;
    @NotNull(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất {min} kí tự")
    private String password;

    private String fcmToken;
}
