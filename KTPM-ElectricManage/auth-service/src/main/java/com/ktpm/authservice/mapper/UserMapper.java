package com.ktpm.authservice.mapper;

import com.ktpm.authservice.model.User;
import com.ktpm.authservice.vo.response.UserResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(User user);
}
