package com.findjb.findjob.Seeder;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.findjb.findjob.Model.Role;
import com.findjb.findjob.Repositories.RoleRepository;

@Component
public class RoleSeeder implements CommandLineRunner {
    @Autowired
    RoleRepository repository;

    @Override
    public void run(String... args) throws Exception {
        seedData();

    }

    public void seedData() {
        if (repository.count() == 0) {
            List<Role> roles = new ArrayList<>();
            Role seeker = Role.builder().name("freelancer").build();
            Role enterprise = Role.builder().name("enterprise").build();
            roles.add(seeker);
            roles.add(enterprise);
            repository.saveAll(roles);
        }
    }
}
