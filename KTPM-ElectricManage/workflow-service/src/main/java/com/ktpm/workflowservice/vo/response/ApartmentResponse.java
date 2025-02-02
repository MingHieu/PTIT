package com.ktpm.workflowservice.vo.response;

import com.ktpm.workflowservice.model.Apartment;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApartmentResponse {

    private Apartment apartment;

    private ElectricityServiceResponse electricityService;

}
