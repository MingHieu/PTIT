package com.findjb.findjob.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.findjb.findjob.Request.FcmToken;
import com.findjb.findjob.Responses.StatusResponse;
import com.findjb.findjob.Service.JPA.UserService;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @PutMapping("api/user/setFcm")
    public ResponseEntity<Object> setFcmToken(@RequestBody FcmToken fcmToken) {
        userService.setFcmToken(fcmToken);
        return new ResponseEntity<Object>(new StatusResponse(true, "Thành công"), HttpStatus.OK);
    }
}
