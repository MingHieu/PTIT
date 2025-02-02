package com.ltw.shorten_link;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ShortenLinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShortenLinkApplication.class, args);
	}

}
