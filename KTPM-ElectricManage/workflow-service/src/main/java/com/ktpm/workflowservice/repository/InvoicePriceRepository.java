package com.ktpm.workflowservice.repository;

import com.ktpm.workflowservice.model.InvoicePrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoicePriceRepository extends JpaRepository<InvoicePrice, Long> {

    List<InvoicePrice> findAllByInvoiceId(Long id);

}
