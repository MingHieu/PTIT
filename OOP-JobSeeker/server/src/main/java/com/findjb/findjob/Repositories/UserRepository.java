package com.findjb.findjob.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.findjb.findjob.Model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
