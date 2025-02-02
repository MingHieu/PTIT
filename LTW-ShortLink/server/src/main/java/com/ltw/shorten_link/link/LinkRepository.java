package com.ltw.shorten_link.link;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ltw.shorten_link.user.User;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findAllByUser(User user, PageRequest PageRequest);

    @Query(value = "SELECT link FROM Link link JOIN link.usersAffiliated user WHERE user.id = :userId")
    Set<Link> findAllAffiliateByUserId(Long userId);

    List<Link> findAllByIsAffiliate(boolean isAffiliate, PageRequest pageRequest);
}
