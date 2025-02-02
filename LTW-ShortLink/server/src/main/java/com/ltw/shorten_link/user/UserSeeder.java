package com.ltw.shorten_link.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ltw.shorten_link.role.RoleRepository;

@Component
public class UserSeeder {
        @Autowired
        UserRepository repository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        RoleRepository roleRepository;

        public void seedData() {
                User user = new User(1, "user", this.passwordEncoder.encode("1234"), "user", 0L,
                                roleRepository.findByName("user"), null);
                repository.save(user);

                User admin = new User(2, "admin", this.passwordEncoder.encode("1234"), "admin", 0L,
                                roleRepository.findByName("admin"), null);
                repository.save(admin);
        }
}
