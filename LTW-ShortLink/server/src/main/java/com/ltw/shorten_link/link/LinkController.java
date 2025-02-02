package com.ltw.shorten_link.link;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ltw.shorten_link.link.payload.CreateLinkRequest;
import com.ltw.shorten_link.link.payload.CreateLinkResponse;
import com.ltw.shorten_link.link.payload.CustomLink;
import com.ltw.shorten_link.shared.Pagination;

import jakarta.validation.Valid;

@RestController
@RequestMapping("link")
public class LinkController {
    @Autowired
    private LinkService linkService;

    @PostMapping("create")
    public CreateLinkResponse create(@Valid @RequestBody CreateLinkRequest body) {
        return new CreateLinkResponse(linkService.createAndGetShortLink(body));
    }

    @GetMapping("/s/{code}")
    public Link getByShortLink(@PathVariable String code) {
        return linkService.getOne(linkService.decode(code));
    }

    @GetMapping("{id}")
    public Link getById(@PathVariable long id) {
        return linkService.getOne(id);
    }

    @PostMapping("all")
    public Pagination<Link> getMany(@Valid @RequestBody Pagination<Link> body) {
        return linkService.getMany(body);
    }

    @PostMapping("all/{username}")
    public Pagination<CustomLink> getManyByUsername(@PathVariable String username,
            @Valid @RequestBody Pagination<CustomLink> body) {
        return linkService.getManyByUsername(username, body);
    }

    @GetMapping("affiliate/all/me")
    public Set<Link> getMeAffiliatedList() {
        return linkService.getMeAffiliatedList();
    }

    @PostMapping("affiliate/all")
    public Pagination<Link> getAffiliatedList(
            @Valid @RequestBody Pagination<Link> body) {
        return linkService.getAffiliatedList(body);
    }

    @PostMapping("affiliate/{id}")
    public Link acceptAffiliate(@PathVariable long id) {
        return linkService.acceptAffiliate(id);
    }
}
