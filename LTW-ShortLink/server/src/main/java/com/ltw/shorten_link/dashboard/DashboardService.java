package com.ltw.shorten_link.dashboard;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltw.shorten_link.link.LinkRepository;
import com.ltw.shorten_link.request.RequestRepository;
import com.ltw.shorten_link.user.UserRepository;

@Service
public class DashboardService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LinkRepository linkRepository;

    @Autowired
    private RequestRepository requestRepository;

    public Map<String, Object> get() {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("userCount", userRepository.count());
        map.put("linkCount", linkRepository.count());
        map.put("requestCount", requestRepository.count());
        return map;
    }
}
