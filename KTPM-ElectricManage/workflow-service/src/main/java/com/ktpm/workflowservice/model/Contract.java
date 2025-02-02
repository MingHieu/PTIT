package com.ktpm.workflowservice.model;

import com.ktpm.workflowservice.vo.enums.ContractStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @CreatedDate
    private Date createdAt;

    private Date fromDate;

    private Date toDate;

    private Long electricityUsageNumber;

    @Enumerated(EnumType.ORDINAL)
    private ContractStatus status;

    private Long electricityServiceId;

    private Long apartmentId;

}
