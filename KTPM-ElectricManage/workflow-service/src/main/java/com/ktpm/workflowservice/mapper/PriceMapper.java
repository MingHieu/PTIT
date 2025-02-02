package com.ktpm.workflowservice.mapper;

import com.ktpm.workflowservice.model.Price;
import com.ktpm.workflowservice.vo.response.PriceResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PriceMapper {

    PriceResponse toPriceResponse(Price price);

}
