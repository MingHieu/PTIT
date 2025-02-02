package com.ltw.shorten_link;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ltw.shorten_link.role.RoleSeeder;
import com.ltw.shorten_link.user.UserSeeder;

@Component
public class Seeder implements CommandLineRunner {

    @Autowired
    RoleSeeder roleSeeder;

    @Autowired
    UserSeeder userSeeder;

    @Override
    public void run(String... args) throws Exception {
        roleSeeder.seedData();
        userSeeder.seedData();
    }

}
