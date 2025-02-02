package com.findjb.findjob.Responses;

import com.google.auto.value.AutoValue.Builder;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ApplicantResponse {
    Object applicant;
    Integer status;
}
