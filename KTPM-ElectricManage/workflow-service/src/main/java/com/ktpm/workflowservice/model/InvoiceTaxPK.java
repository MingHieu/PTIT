package com.ktpm.workflowservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceTaxPK implements Serializable {

    private Long taxId;

    private Long invoiceId;

}
