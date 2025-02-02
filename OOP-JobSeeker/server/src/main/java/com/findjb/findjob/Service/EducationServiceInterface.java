package com.findjb.findjob.Service;

import java.util.List;

import com.findjb.findjob.Model.Education;
import com.findjb.findjob.Request.EducationRequest;

public interface EducationServiceInterface {
    void createEducation(EducationRequest educationRequest);

    void updateEducation(EducationRequest educationRequest,Long id);

    List<Education> getListEducation();

    Education getDetailEducation(Long id);

    void deleteEducation(Long id);
}
