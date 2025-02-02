package com.ltw.shorten_link.link.payload;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ltw.shorten_link.link.Link;
import com.ltw.shorten_link.user.User;

public class CustomLink extends Link {
    
    public CustomLink(Link link) {
        this.setId(link.getId());
        this.setCreatedAt(link.getCreatedAt());
        this.setTitle(link.getTitle());
        this.setUrl(link.getUrl());
        this.setAffiliate(link.isAffiliate());
        this.setUser(link.getUser());
        this.setClicks(link.getClicks());
    }

    @Override
    @JsonIgnore
    public User getUser() {
        return super.getUser();
    }
}
