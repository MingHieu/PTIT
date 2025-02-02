package com.ltw.shorten_link.click;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.ltw.shorten_link.link.Link;
import com.ltw.shorten_link.link.LinkRepository;
import com.ltw.shorten_link.user.User;
import com.ltw.shorten_link.user.UserRepository;

@Service
public class ClickService {
    @Autowired
    private ClickRepository clickRepository;

    @Autowired
    private LinkRepository linkRepository;

    @Autowired
    private UserRepository userRepository;

    public Click create(long linkId, String username) {
        Link link = linkRepository.findById(linkId).get();
        Click click = new Click();
        click.setLink(link);
        if (link.isAffiliate()) {
            if (link.getClicks().size() < link.getExpectedClicks()) {
                User user = userRepository.findByUsername(username);
                user.setMoney(user.getMoney() + link.getMoney() / link.getExpectedClicks());
            }
        }
        return clickRepository.save(click);
    }
}
