package com.ktpm.workflowservice.repository;

import com.ktpm.workflowservice.model.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    List<Apartment> findAllByOwnerId(Long ownerId);

}
