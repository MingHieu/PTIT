package com.ktpm.workflowservice.repository;

import com.ktpm.workflowservice.model.ElectricityService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ElectricityServiceRepository extends JpaRepository<ElectricityService, Long> {

    List<ElectricityService> findAllByIdIn(List<Long> ids);

    List<ElectricityService> findAllByNameContains(String name);

}
