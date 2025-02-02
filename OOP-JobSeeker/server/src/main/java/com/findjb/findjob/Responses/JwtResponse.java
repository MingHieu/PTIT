package com.findjb.findjob.Responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    String token;
    // private String type = "Bearer";
    Long id;
    String email;
    Long role;
    Object detail;
}
