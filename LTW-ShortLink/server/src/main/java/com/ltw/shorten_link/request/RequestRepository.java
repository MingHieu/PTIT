package com.ltw.shorten_link.request;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.ltw.shorten_link.user.User;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findAllByUser(User user, PageRequest PageRequest);
}
