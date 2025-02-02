package com.ltw.shorten_link.request.payload;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ltw.shorten_link.request.Request;
import com.ltw.shorten_link.user.User;

public class CustomRequest extends Request{
    
    public CustomRequest(Request request) {
        this.setId(request.getId());
        this.setCreateAt(request.getCreateAt());
        this.setType(request.getType());
        this.setValue(request.getValue());
        this.setStatus(request.getStatus());
        this.setUser(request.getUser());
    }

    @Override
    @JsonIgnore
    public User getUser() {
        return super.getUser();
    }
}
