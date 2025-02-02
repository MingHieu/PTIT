package com.findjb.findjob.Responses;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ObjectResponse {
    Boolean status;
    String message;
    Object data;
}
