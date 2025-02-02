package com.ktpm.workflowservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(InvoiceTaxPK.class)
@Builder
public class InvoiceTax {

    private Long value;

    @Id
    private Long taxId;

    @Id
    private Long invoiceId;

}
