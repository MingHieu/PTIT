package com.findjb.findjob.Request;

import lombok.Data;

@Data
public class EducationRequest {
    private String name;
    private String major;
    private String fromDate;
    private String toDate;
    private String description;
}
