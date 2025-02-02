package com.ktpm.workflowservice.repository;

import com.ktpm.workflowservice.model.Tax;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaxRepository extends JpaRepository<Tax, Long> {

    List<Tax> findAllByIdIn(List<Long> ids);

}
