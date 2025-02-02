package com.ltw.shorten_link.request;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ltw.shorten_link.request.payload.CreateRequestRequest;
import com.ltw.shorten_link.request.payload.CustomRequest;
import com.ltw.shorten_link.request.payload.UpdateRequestRequest;
import com.ltw.shorten_link.shared.Pagination;

import jakarta.validation.Valid;

@RestController
@RequestMapping("request")
public class RequestController {
    @Autowired
    private RequestService requestService;

    @PostMapping("create")
    public Request create(@Valid @RequestBody CreateRequestRequest body) {
        return requestService.create(body);
    }

    @PostMapping("update")
    public Request update(@Valid @RequestBody UpdateRequestRequest body) {
        return requestService.update(body);
    }

    @GetMapping("{id}")
    public Request getOne(@PathVariable Long id) {
        return requestService.getOne(id);
    }

    @PostMapping("all")
    public Pagination<Request> getMany(@Valid @RequestBody Pagination<Request> body) {
        return requestService.getMany(body);
    }

    @PostMapping("all/{username}")
    public Pagination<CustomRequest> getManyByUsername(@PathVariable String username,
            @Valid @RequestBody Pagination<CustomRequest> body) {
        return requestService.getManyByUsername(username, body);
    }
}
