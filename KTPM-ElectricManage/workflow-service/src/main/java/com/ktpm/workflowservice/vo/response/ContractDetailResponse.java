package com.ktpm.workflowservice.vo.response;

import com.ktpm.workflowservice.model.ElectricityService;
import com.ktpm.workflowservice.vo.enums.ContractStatus;
import lombok.Data;

import java.util.Date;

@Data
public class ContractDetailResponse {

    private Long id;

    private Long electricityUsageNumber;

    private Date createdAt;

    private Date fromDate;

    private Date toDate;

    private ContractStatus status;

    private Long apartmentId;

    private ElectricityService electricityService;

}
