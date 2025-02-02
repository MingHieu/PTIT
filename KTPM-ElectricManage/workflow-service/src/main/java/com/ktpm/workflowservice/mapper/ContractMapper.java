package com.ktpm.workflowservice.mapper;

import com.ktpm.workflowservice.model.Contract;
import com.ktpm.workflowservice.vo.response.ContractDetailResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ContractMapper {

    ContractDetailResponse toContractDetailResponse(Contract contract);
}
