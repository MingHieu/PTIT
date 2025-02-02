package com.ktpm.workflowservice.service;

import com.ktpm.workflowservice.mapper.ContractMapper;
import com.ktpm.workflowservice.model.Contract;
import com.ktpm.workflowservice.model.ElectricityService;
import com.ktpm.workflowservice.model.Invoice;
import com.ktpm.workflowservice.repository.ContractRepository;
import com.ktpm.workflowservice.repository.ElectricityServiceRepository;
import com.ktpm.workflowservice.repository.InvoiceRepository;
import com.ktpm.workflowservice.vo.enums.ContractStatus;
import com.ktpm.workflowservice.vo.request.ApproveContractRequestBody;
import com.ktpm.workflowservice.vo.request.CreateContractRequestBody;
import com.ktpm.workflowservice.vo.response.ContractDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;

    private final ElectricityServiceRepository electricityServiceRepository;

    private final InvoiceRepository invoiceRepository;

    private final ContractMapper contractMapper;


    public Contract createContract(CreateContractRequestBody requestBody) {
        Contract contract = Contract.builder()
                .apartmentId(requestBody.getApartmentId())
                .status(ContractStatus.PENDING)
                .electricityServiceId(requestBody.getElectricityServiceId())
                .build();

        return contractRepository.save(contract);
    }

    public List<Contract> getAllContract(Long apartmentId) {
        return contractRepository.findAllByApartmentId(apartmentId);
    }

    public ContractDetailResponse getContractDetail(Long contractId) {
        Contract contract = contractRepository.findById(contractId).orElseThrow();

        ElectricityService electricityService = electricityServiceRepository.findById(contract.getElectricityServiceId()).orElseThrow();

        ContractDetailResponse contractDetailResponse = contractMapper.toContractDetailResponse(contract);
        contractDetailResponse.setElectricityService(electricityService);

        return contractDetailResponse;
    }

    public Contract approveContract(Long contractId, ApproveContractRequestBody requestBody) throws Exception {
        Contract contract = contractRepository.findById(contractId).orElseThrow();

        if (contract.getStatus() != ContractStatus.PENDING) {
            throw new Exception("Hợp đồng đã được xử lí");
        }

        if (requestBody.isApproved()) {
            contract.setStatus(ContractStatus.IN_PROGRESS);
            contract.setFromDate(new Date());
            contract.setElectricityUsageNumber(requestBody.getElectricityUsageNumber());
        } else {
            contract.setStatus(ContractStatus.REJECTED);
        }

        return contractRepository.save(contract);
    }

}
