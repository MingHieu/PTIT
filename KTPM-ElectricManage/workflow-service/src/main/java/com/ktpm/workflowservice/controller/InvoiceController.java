package com.ktpm.workflowservice.controller;

import com.ktpm.workflowservice.service.InvoiceService;
import com.ktpm.workflowservice.vo.request.CreateInvoiceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("invoice")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/create")
    public Object create(@RequestBody CreateInvoiceRequest request) {
        return invoiceService.create(request);
    }

}
