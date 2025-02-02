package com.findjb.findjob.Controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.findjb.findjob.Fcm.FCMService;
import com.findjb.findjob.JWT.JwtUtils;
import com.findjb.findjob.JWT.JWTServices.UserDetailsImplement;
import com.findjb.findjob.Model.Enterprise;
import com.findjb.findjob.Model.Freelancer;
import com.findjb.findjob.Repositories.RoleRepository;
import com.findjb.findjob.Repositories.UserRepository;
import com.findjb.findjob.Request.FcmNotification;
import com.findjb.findjob.Request.LoginRequest;
import com.findjb.findjob.Responses.DataResponse;
import com.findjb.findjob.Responses.JwtResponse;
import com.findjb.findjob.Responses.ObjectResponse;
import com.findjb.findjob.Responses.StatusResponse;

@RestController
@RequestMapping({ "/api/auth" })
public class AuthController {

        @PersistenceContext
        private EntityManager entityManager;

        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        UserRepository userRepository;

        @Autowired
        RoleRepository roleRepository;

        @Autowired
        PasswordEncoder encoder;

        @Autowired
        JwtUtils jwtUtils;

        @Autowired
        FCMService fcmService;

        @PostMapping({ "/login" })
        public ResponseEntity<Object> authenticateUser(@RequestBody LoginRequest loginRequest) throws Exception {
                try {
                        Authentication authentication = authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                                                        loginRequest.getPassword()));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        String jwt = jwtUtils.generateJwtToken(authentication);

                        UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
                        List<String> roles = userDetails.getAuthorities().stream()
                                        .map(item -> item.getAuthority())
                                        .collect(Collectors.toList());
                        String role = roles.get(0);
                        Long role_id = roleRepository.findByName(role).getId();
                        Object detail = new Object();
                        if (role_id == 2) {
                                detail = entityManager.find(Enterprise.class, userDetails.getId());

                        } else {
                                detail = entityManager.find(Freelancer.class, userDetails.getId());
                        }
                        try{
                                String fcmToken = userRepository.findById(userDetails.getId()).get().getFcmToken();
                                FcmNotification fcmNotification = new FcmNotification(fcmToken, "Đăng nhập thành công", "", null);
                                fcmService.pushNotification(fcmNotification);
                        }
                        catch(Exception e){
                        }
                        return new ResponseEntity<Object>(
                                        new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), role_id,
                                                        detail),
                                        HttpStatus.OK);
                } catch (Exception e) {
                        return new ResponseEntity<Object>(new StatusResponse(false, e.getMessage()),
                                        HttpStatus.UNAUTHORIZED);
                }
        }

        @GetMapping("/user/detail")
        public ResponseEntity<Object> getUserDetail() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                                .map(item -> item.getAuthority())
                                .collect(Collectors.toList());
                String role = roles.get(0);
                Long role_id = roleRepository.findByName(role).getId();
                Object detail = new Object();
                if (role_id == 2) {
                        detail = new DataResponse(role_id, entityManager.find(Enterprise.class, userDetails.getId()));

                } else {
                        detail = new DataResponse(role_id, entityManager.find(Freelancer.class, userDetails.getId()));
                }
                return new ResponseEntity<Object>(new ObjectResponse(true, "Lấy chi tiết thành công", detail),
                                HttpStatus.OK);
        }
}
