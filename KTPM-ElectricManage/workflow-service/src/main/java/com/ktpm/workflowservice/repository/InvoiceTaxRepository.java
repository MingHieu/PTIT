package com.ktpm.workflowservice.repository;

import com.ktpm.workflowservice.model.InvoiceTax;
import com.ktpm.workflowservice.model.InvoiceTaxPK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceTaxRepository extends JpaRepository<InvoiceTax, InvoiceTaxPK> {

    List<InvoiceTax> findAllByInvoiceId(Long id);

}
