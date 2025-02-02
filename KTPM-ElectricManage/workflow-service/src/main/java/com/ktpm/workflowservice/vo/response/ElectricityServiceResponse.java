package com.ktpm.workflowservice.vo.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ElectricityServiceResponse {

    private Long id;

    private String name;

    private List<PriceResponse> prices;

}
