package com.findjb.findjob.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.findjb.findjob.Model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String rollName);
}
