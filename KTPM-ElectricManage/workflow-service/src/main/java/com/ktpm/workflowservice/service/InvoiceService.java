package com.ktpm.workflowservice.service;

import com.ktpm.workflowservice.model.*;
import com.ktpm.workflowservice.repository.*;
import com.ktpm.workflowservice.vo.request.CreateInvoiceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final ContractRepository contractRepository;

    private final PriceRepository priceRepository;

    private final InvoicePriceRepository invoicePriceRepository;

    private final TaxRepository taxRepository;

    private final InvoiceTaxRepository invoiceTaxRepository;

    public Boolean create(CreateInvoiceRequest request) {
        // Save Invoice
        Invoice savedInvoice = invoiceRepository.save(Invoice.builder()
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .electricityUsageNumber(request.getElectricityUsageNumber())
                .contractId(request.getContractId())
                .build());

        // Save InvoicePrice
        Contract contract = contractRepository.findById(request.getContractId()).orElseThrow();
        List<Price> prices = priceRepository.findAllByElectricityServiceId(contract.getElectricityServiceId());
        invoicePriceRepository.saveAll(prices.stream().map(price -> InvoicePrice.builder()
                .fromValue(price.getFromValue())
                .toValue(price.getToValue())
                .price(price.getPrice())
                .invoiceId(savedInvoice.getId())
                .build()).toList());

        // Save InvoiceTax
        Tax tax = taxRepository.findById(request.getTaxId()).orElseThrow();
        invoiceTaxRepository.save(InvoiceTax.builder()
                .value(tax.getValue())
                .invoiceId(savedInvoice.getId())
                .taxId(tax.getId())
                .build());

        return true;
    }

}

