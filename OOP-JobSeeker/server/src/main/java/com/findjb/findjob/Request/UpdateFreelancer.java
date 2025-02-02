package com.findjb.findjob.Request;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class UpdateFreelancer {
    @Size(max = 100, message = "Tên quá dài")
    private String name;
    private String dob;
    private Integer gender;
    @Size(max = 200, message = "Địa chỉ quá dài")
    private String address;
    @Size(min = 10, max = 10, message = "Số điện thoại phải có 10 chữ số")
    @Pattern(regexp = "(84|0[3|5|7|8|9])+([0-9]{8})")
    private String phone_number;
    @Size(max = 255, message = "Quá dài")
    private String introduction;
    private Integer level;
    private String avatar;
}
