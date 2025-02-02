package com.ktpm.workflowservice.repository;

import com.ktpm.workflowservice.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceRepository extends JpaRepository<Price, Long> {

    List<Price> findAllByElectricityServiceIdIn(List<Long> ids);

    List<Price> findAllByElectricityServiceId(Long id);

}
