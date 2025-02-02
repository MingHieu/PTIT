package com.ltw.shorten_link.click;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ltw.shorten_link.click.payload.CreateClickRequest;

import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("click")
public class ClickController {
    @Autowired
    private ClickService clickService;

    @PostMapping("create")
    public Click create(@Valid @RequestBody CreateClickRequest body, @PathParam(value = "username") String username) {
        return clickService.create(body.getLinkId(), username);
    }
}
