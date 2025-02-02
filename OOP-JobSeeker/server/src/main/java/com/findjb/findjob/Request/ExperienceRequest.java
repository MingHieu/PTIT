package com.findjb.findjob.Request;

import lombok.Data;

@Data
public class ExperienceRequest {
    String name;
    String position;
    String fromDate;
    String toDate;
    String description;
}
