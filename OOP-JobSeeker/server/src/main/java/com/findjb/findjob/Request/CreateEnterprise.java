package com.findjb.findjob.Request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.findjb.findjob.Constraint.Unique;

import lombok.Data;

@Data
public class CreateEnterprise {
    @NotNull(message = "Tên không được để trống")
    @Size(max = 100, message = "Tên quá dài")
    private String name;

    @NotNull(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Unique(message = "Email đã tồn tại")
    private String email;

    @NotNull(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu không phải có ít nhất {min} kí tự")
    private String password;

    @NotNull(message = "Địa chỉ không được để trống")
    @Size(max = 200,message = "Địa chỉ quá dài")
    private String address;

    private String fcmToken;
}
