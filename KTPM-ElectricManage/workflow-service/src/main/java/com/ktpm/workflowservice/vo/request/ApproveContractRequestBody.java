package com.ktpm.workflowservice.vo.request;

import lombok.Data;

@Data
public class ApproveContractRequestBody {

    private boolean approved;

    private Long electricityUsageNumber;

}
