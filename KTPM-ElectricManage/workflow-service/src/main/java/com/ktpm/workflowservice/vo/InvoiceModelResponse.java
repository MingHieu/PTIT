package com.ktpm.workflowservice.vo;

import com.ktpm.workflowservice.model.Tax;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
public class InvoiceModelResponse implements Serializable {

    private Invoice invoice;
    private Contract contract;
    private Apartment apartment;
    private ElectricityService electricityService;
    private List<Price> prices;
    private List<Tax> taxes;
    private Customer customer;

    @Data
    public static class Invoice {
        private Long id;
        private Date createdAt;
        private Date fromDate;
        private Date toDate;
        private Long oldElectricityUsage;
        private Long newElectricityUsage;
        private Long customerId;
        private Long total;
    }

    @Data
    public static class Contract {
        private Long id;
    }

    @Data
    public static class Apartment {
        private Long id;
        private String address;
    }

    @Data
    public static class ElectricityService {
        private Long id;
        private String name;
        private String description;
    }

    @Data
    public static class Price {
        private Long fromValue;
        private Long toValue;
        private Long price;
    }

}
