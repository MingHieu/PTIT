package com.ltw.shorten_link.role;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder {
    @Autowired
    RoleRepository repository;

    public void seedData() {
        Role user = Role.builder().name("user").id(1).build();
        Role admin = Role.builder().name("admin").id(2).build();
        repository.saveAll(Arrays.asList(new Role[] { user, admin }));
    }
}
