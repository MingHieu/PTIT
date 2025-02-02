package com.ktpm.workflowservice.service;

import com.ktpm.workflowservice.vo.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final RestTemplate authServiceRestTemplate;

    public List<Customer> getAllCustomerById(List<Long> ids) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString("/customer/all");
        for (Long id : ids) {
            builder.queryParam("ids", id);
        }

        ResponseEntity<List<Customer>> responseEntity = authServiceRestTemplate.exchange(
                builder.toUriString(),
                org.springframework.http.HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Customer>>() {
                }
        );

        return responseEntity.getBody();
    }

}
