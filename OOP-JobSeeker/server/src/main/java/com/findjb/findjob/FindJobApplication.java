package com.findjb.findjob;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.findjb.findjob.Repositories.RoleRepository;


@SpringBootApplication
public class FindJobApplication {
	@Autowired
	RoleRepository repository;

	public static void main(String[] args) {
		SpringApplication.run(FindJobApplication.class, args);
	}
}
