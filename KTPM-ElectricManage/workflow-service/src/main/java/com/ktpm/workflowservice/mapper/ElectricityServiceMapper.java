package com.ktpm.workflowservice.mapper;

import com.ktpm.workflowservice.model.ElectricityService;
import com.ktpm.workflowservice.vo.response.ElectricityServiceResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ElectricityServiceMapper {

    ElectricityServiceResponse toElectricityServiceResponse(ElectricityService electricityService);

}
