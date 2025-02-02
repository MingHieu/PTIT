package com.ktpm.workflowservice.vo.request;

import lombok.Data;

import java.util.Date;

@Data
public class CreateInvoiceRequest {

    private Long contractId;

    private Long taxId;

    private Date fromDate;

    private Date toDate;

    private Long electricityUsageNumber;

}
