package com.ktpm.workflowservice.service;

import com.ktpm.workflowservice.model.Tax;
import com.ktpm.workflowservice.repository.custom.InvoiceRepositoryCustom;
import com.ktpm.workflowservice.vo.Customer;
import com.ktpm.workflowservice.vo.InvoiceModelResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final InvoiceRepositoryCustom reportRepository;

    private final CustomerService customerService;

    public Object monthlyRevenue(int year) {
        Calendar firstDayOfYear = Calendar.getInstance();
        firstDayOfYear.clear();
        firstDayOfYear.set(year, Calendar.JANUARY, 1);

        Calendar lastDayOfYear = Calendar.getInstance();
        lastDayOfYear.clear();
        lastDayOfYear.set(year, Calendar.DECEMBER, 31);

        HashMap<Integer, List<InvoiceModelResponse>> map = reportRepository.findAllByCreatedAtBetween(firstDayOfYear.getTime(), lastDayOfYear.getTime());
        List<Customer> customers = customerService.getAllCustomerById(getAllCustomerIds(map));
        List<List<InvoiceModelResponse>> response = new ArrayList<>();

        for (int i = 1; i <= 12; i++) {
            List<InvoiceModelResponse> invoiceModelResponses = map.getOrDefault(i, List.of());
            invoiceModelResponses.forEach(invoiceModelResponse -> {
                Customer customer = customers.stream()
                        .filter(c -> c.getId().equals(invoiceModelResponse.getInvoice().getCustomerId()))
                        .findFirst()
                        .orElse(null);
                invoiceModelResponse.setCustomer(customer);
                InvoiceModelResponse.Invoice invoice = invoiceModelResponse.getInvoice();
                invoice.setTotal(calculateTotal(invoice.getOldElectricityUsage(), invoice.getNewElectricityUsage(), invoiceModelResponse.getPrices(), invoiceModelResponse.getTaxes()));
            });
            response.add(invoiceModelResponses);
        }

        return response;
    }

    public List<Long> getAllCustomerIds(HashMap<Integer, List<InvoiceModelResponse>> map) {
        List<Long> customerIds = new ArrayList<>();

        for (List<InvoiceModelResponse> invoiceModelResponses : map.values()) {
            for (InvoiceModelResponse invoiceModelResponse : invoiceModelResponses) {
                customerIds.add(invoiceModelResponse.getInvoice().getCustomerId());
            }
        }

        return customerIds;
    }

    private Long calculateTotal(Long oldUsageNumber, Long newUsageNumber, List<InvoiceModelResponse.Price> prices, List<Tax> taxes) {
        long total = 0;
        long currentUsage = newUsageNumber - oldUsageNumber;

        for (InvoiceModelResponse.Price price : prices) {
            long rangeUsage = currentUsage;
            if (price.getToValue() != null) {
                rangeUsage = Math.min(currentUsage, price.getToValue() - price.getFromValue());
            }
            total += rangeUsage * price.getPrice();
            currentUsage -= rangeUsage;
            if (currentUsage <= 0) break;
        }

        long totalAfterTax = total;
        for (Tax tax : taxes) {
            totalAfterTax += total * tax.getValue() / 100;
        }

        return totalAfterTax;
    }

}
