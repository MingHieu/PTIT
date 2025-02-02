package com.ktpm.workflowservice.service;

import com.ktpm.workflowservice.mapper.ElectricityServiceMapper;
import com.ktpm.workflowservice.mapper.PriceMapper;
import com.ktpm.workflowservice.model.ElectricityService;
import com.ktpm.workflowservice.model.Price;
import com.ktpm.workflowservice.repository.ElectricityServiceRepository;
import com.ktpm.workflowservice.repository.PriceRepository;
import com.ktpm.workflowservice.vo.response.ElectricityServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElectricityServiceService {

    private final ElectricityServiceRepository electricityServiceRepository;

    private final PriceRepository priceRepository;

    private final ElectricityServiceMapper electricityServiceMapper;

    private final PriceMapper priceMapper;

    public ElectricityServiceResponse getServiceDetail(Long id) {
        ElectricityService electricityService = electricityServiceRepository.findById(id).orElseThrow();
        List<Price> prices = priceRepository.findAllByElectricityServiceIdIn(List.of(electricityService.getId()));
        ElectricityServiceResponse response = electricityServiceMapper.toElectricityServiceResponse(electricityService);
        response.setPrices(prices.stream()
                .filter(price -> price.getElectricityServiceId().equals(electricityService.getId()))
                .map(priceMapper::toPriceResponse).toList());
        return response;
    }

    public List<ElectricityServiceResponse> getAllServices(String name) {
        List<ElectricityService> electricityServiceList = electricityServiceRepository.findAllByNameContains(name);
        List<Price> prices = priceRepository.findAllByElectricityServiceIdIn(electricityServiceList.stream().map(ElectricityService::getId).toList());
        return electricityServiceList.stream()
                .map(electricityService -> {
                    ElectricityServiceResponse response = electricityServiceMapper.toElectricityServiceResponse(electricityService);
                    response.setPrices(prices.stream()
                            .filter(price -> price.getElectricityServiceId().equals(electricityService.getId()))
                            .map(priceMapper::toPriceResponse).toList());
                    return response;
                }).toList();
    }

    public List<ElectricityService> getAllServicesByIdIn(List<Long> ids) {
        return electricityServiceRepository.findAllByIdIn(ids);
    }

}
