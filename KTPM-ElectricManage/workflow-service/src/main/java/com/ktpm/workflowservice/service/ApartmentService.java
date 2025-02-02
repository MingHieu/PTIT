package com.ktpm.workflowservice.service;

import com.ktpm.workflowservice.mapper.PriceMapper;
import com.ktpm.workflowservice.model.Apartment;
import com.ktpm.workflowservice.model.Contract;
import com.ktpm.workflowservice.model.ElectricityService;
import com.ktpm.workflowservice.model.Price;
import com.ktpm.workflowservice.repository.ApartmentRepository;
import com.ktpm.workflowservice.repository.ContractRepository;
import com.ktpm.workflowservice.repository.ElectricityServiceRepository;
import com.ktpm.workflowservice.repository.PriceRepository;
import com.ktpm.workflowservice.vo.enums.ContractStatus;
import com.ktpm.workflowservice.vo.response.ApartmentResponse;
import com.ktpm.workflowservice.vo.response.ElectricityServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;

    private final ContractRepository contractRepository;

    private final ElectricityServiceRepository electricityServiceRepository;

    private final PriceRepository priceRepository;

    private final PriceMapper priceMapper;


    public Apartment saveApartment(Apartment apartment) {
        return apartmentRepository.save(apartment);
    }

    public List<Apartment> getAllApartment(Long ownerId) {
        return apartmentRepository.findAllByOwnerId(ownerId);
    }

    public ApartmentResponse getApartmentDetail(Long id) {
        ApartmentResponse res = new ApartmentResponse();

        Apartment apartment = apartmentRepository.findById(id).orElseThrow();
        res.setApartment(apartment);

        Optional<Contract> contractOptional = contractRepository.findFirstByApartmentIdAndStatus(apartment.getId(), ContractStatus.IN_PROGRESS);
        if (contractOptional.isEmpty()) {
            return res;
        }

        ElectricityService electricityService = electricityServiceRepository.findById(contractOptional.get().getElectricityServiceId()).orElseThrow();
        List<Price> prices = priceRepository.findAllByElectricityServiceId(electricityService.getId());
        res.setElectricityService(ElectricityServiceResponse.builder()
                .id(electricityService.getId())
                .name(electricityService.getName())
                .prices(prices.stream().map(priceMapper::toPriceResponse).toList()).build());

        return res;
    }

}
