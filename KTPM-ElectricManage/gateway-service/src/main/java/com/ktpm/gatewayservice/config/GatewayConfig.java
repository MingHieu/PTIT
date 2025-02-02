package com.ktpm.gatewayservice.config;

import com.ktpm.gatewayservice.filter.AuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class GatewayConfig {
    private final AuthenticationFilter authenticationFilter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/auth-service/**")
                        .filters(f -> f.stripPrefix(1).filters(authenticationFilter))
                        .uri("lb://auth-service"))
                .route("workflow-service", r -> r.path("/workflow-service/**")
                        .filters(f -> f.stripPrefix(1).filters(authenticationFilter))
                        .uri("lb://workflow-service"))
                .route("report-service", r -> r.path("/report-service/**")
                        .filters(f -> f.stripPrefix(1).filters(authenticationFilter))
                        .uri("lb://report-service"))
                .build();
    }
}
