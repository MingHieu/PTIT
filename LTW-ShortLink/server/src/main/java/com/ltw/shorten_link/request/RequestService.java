package com.ltw.shorten_link.request;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ltw.shorten_link.auth.JwtUserDetails;
import com.ltw.shorten_link.request.payload.CreateRequestRequest;
import com.ltw.shorten_link.request.payload.CustomRequest;
import com.ltw.shorten_link.request.payload.UpdateRequestRequest;
import com.ltw.shorten_link.shared.Pagination;
import com.ltw.shorten_link.user.User;
import com.ltw.shorten_link.user.UserRepository;

@Service
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    public Request create(CreateRequestRequest body) {
        User user = userRepository.findByUsername(
                ((JwtUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
        Request request = new Request();
        request.setType(body.getType());
        request.setValue(body.getValue());
        request.setUser(user);
        return requestRepository.save(request);
    }

    public Request update(UpdateRequestRequest body) {
        Request request = requestRepository.findById(body.getId()).get();
        request.setStatus(body.getStatus());
        User user = userRepository.findByUsername(request.getUser().getUsername());
        if (body.getStatus().equals(Request.Status.ACCEPTED)) {
            user.setMoney(user.getMoney() + request.getValue());
        } else {
            if (user.getMoney() >= request.getValue()) {
                user.setMoney(user.getMoney() - request.getValue());
            }
        }
        return requestRepository.save(request);
    }

    public Request getOne(Long id) {
        Request request = requestRepository.findById(id).get();
        return request;
    }

    public Pagination<CustomRequest> getManyByUsername(String username, Pagination<CustomRequest> body) {
        User user = userRepository.findByUsername(username);
        List<Request> requests = requestRepository.findAllByUser(user,
                PageRequest.of(body.page, body.per_page));
        List<CustomRequest> customRequests = requests.stream().map(CustomRequest::new).collect(Collectors.toList());
        body.setData(customRequests);
        return body;
    }

    public Pagination<Request> getMany(Pagination<Request> body) {
        List<Request> requests = requestRepository.findAll(PageRequest.of(body.page, body.per_page)).getContent();
        body.setData(requests);
        return body;
    }
}
