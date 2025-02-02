package com.ktpm.workflowservice.repository;

import com.ktpm.workflowservice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findFirstByContractIdInAndCreatedAtLessThanOrderByCreatedAtDesc(List<Long> ids, Date createdAt);

    List<Invoice> findAllByToDateBetweenOrderByCreatedAtDesc(Date from, Date to);

}
