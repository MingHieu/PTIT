package com.ltw.shorten_link.link;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ltw.shorten_link.auth.JwtUserDetails;
import com.ltw.shorten_link.link.payload.CreateLinkRequest;
import com.ltw.shorten_link.link.payload.CustomLink;
import com.ltw.shorten_link.shared.Pagination;
import com.ltw.shorten_link.user.User;
import com.ltw.shorten_link.user.UserRepository;

@Service
public class LinkService {
    @Autowired
    private LinkRepository linkRepository;

    @Autowired
    private UserRepository userRepository;

    final String MAP = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public String createAndGetShortLink(CreateLinkRequest body) {
        Link link = new Link();
        link.setTitle(body.getTitle());
        link.setUrl(body.getUrl());
        link.setAffiliate(body.getIsAffiliate());
        link.setExpectedClicks(body.getExpectedClicks());
        link.setMoney(body.getMoney());
        try {
            JwtUserDetails userDetails = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername());
            link.setUser(user);
        } catch (Exception e) {
        }
        return encode(linkRepository.save(link).getId());
    }

    public String encode(Long id) {
        ArrayList<Long> digits = new ArrayList<Long>();
        while (id > 0) {
            digits.add(id % 62);
            id /= 62;
        }
        for (int i = digits.size() - 1; i < 6; ++i) {
            digits.add(0L);
        }
        StringBuilder s = new StringBuilder();
        for (long x : digits) {
            s.append(MAP.charAt((int) x));
        }
        return s.reverse().toString();
    }

    public Long decode(String url) {
        String s = new StringBuilder(url).reverse().toString();
        while (s.charAt(0) == '0') {
            s = s.substring(1);
        }
        ArrayList<Long> digits = new ArrayList<Long>();
        for (char x : s.toCharArray()) {
            digits.add((long) MAP.indexOf(x));
        }
        long id = 0;
        for (int i = 0; i < digits.size(); i++) {
            id += digits.get(i) * Math.pow(62, i);
        }
        return id;
    }

    public Link getOne(Long id) {
        return linkRepository.findById(id).get();
    }

    public Pagination<CustomLink> getManyByUsername(String username, Pagination<CustomLink> body) {
        User user = userRepository.findByUsername(username);
        List<Link> links = linkRepository.findAllByUser(user,
                PageRequest.of(body.page, body.per_page));
        List<CustomLink> customLinks = links.stream().map(CustomLink::new).collect(Collectors.toList());
        body.setData(customLinks);
        return body;
    }

    public Pagination<Link> getMany(Pagination<Link> body) {
        List<Link> links = linkRepository.findAll(PageRequest.of(body.page, body.per_page)).getContent();
        body.setData(links);
        return body;
    }

    public Link acceptAffiliate(long id) {
        Link link = linkRepository.findById(id).get();
        if (!link.isAffiliate()) {
            return link;
        }
        JwtUserDetails userDetails = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (link.getUsersAffiliated() != null) {
            link.getUsersAffiliated().add(user);
        } else {
            link.setUsersAffiliated(new HashSet<User>(Arrays.asList(new User[] { user })));
        }
        linkRepository.save(link);
        return link;
    }

    public Set<Link> getMeAffiliatedList() {
        JwtUserDetails userDetails = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());
        return linkRepository.findAllAffiliateByUserId(user.getId());
    }

    public Pagination<Link> getAffiliatedList(Pagination<Link> body) {
        List<Link> links = linkRepository.findAllByIsAffiliate(true, PageRequest.of(body.page, body.per_page));
        body.setData(links);
        return body;
    }
}
