package com.ktpm.workflowservice.controller;

import com.ktpm.workflowservice.service.ContractService;
import com.ktpm.workflowservice.vo.request.ApproveContractRequestBody;
import com.ktpm.workflowservice.vo.request.CreateContractRequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("contract")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @GetMapping("/all")
    public Object getAllContract(@RequestParam("apartmentId") Long apartmentId) {
        return contractService.getAllContract(apartmentId);
    }

    @PostMapping("/create")
    public Object createContract(@RequestBody CreateContractRequestBody requestBody) {
        return contractService.createContract(requestBody);
    }

    @GetMapping("/{id}")
    public Object getContractDetail(@PathVariable Long id) {
        return contractService.getContractDetail(id);
    }

    @PostMapping("/{id}/approve")
    public Object approveContract(@PathVariable Long id, @RequestBody ApproveContractRequestBody requestBody) throws Exception {
        return contractService.approveContract(id, requestBody);
    }

}
