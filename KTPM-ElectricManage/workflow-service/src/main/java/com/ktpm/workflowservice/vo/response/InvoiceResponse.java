package com.ktpm.workflowservice.vo.response;

import com.ktpm.workflowservice.model.Apartment;
import com.ktpm.workflowservice.model.Contract;
import com.ktpm.workflowservice.model.Tax;
import com.ktpm.workflowservice.vo.Customer;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class InvoiceResponse {

    private Customer customer;

    private Apartment apartment;

    private Contract contract;

    private ElectricityServiceResponse service;

    private Long oldUsageNumber;

    private Long newUsageNumber;

    private Date fromDate;

    private Date toDate;

    private Long total;

    private List<Tax> taxes;

}
