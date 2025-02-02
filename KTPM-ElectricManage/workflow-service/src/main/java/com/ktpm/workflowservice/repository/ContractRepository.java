package com.ktpm.workflowservice.repository;

import com.ktpm.workflowservice.model.Contract;
import com.ktpm.workflowservice.vo.enums.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    Optional<Contract> findFirstByApartmentIdAndStatus(Long apartmentId, ContractStatus status);

    List<Contract> findAllByApartmentId(Long apartmentId);

}
