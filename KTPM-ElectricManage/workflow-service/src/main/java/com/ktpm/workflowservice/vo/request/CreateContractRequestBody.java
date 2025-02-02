package com.ktpm.workflowservice.vo.request;

import lombok.Data;

@Data
public class CreateContractRequestBody {

    private String name;

    private Long apartmentId;

    private Long electricityServiceId;

}
