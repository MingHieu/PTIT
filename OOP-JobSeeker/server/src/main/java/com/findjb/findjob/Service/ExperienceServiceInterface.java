package com.findjb.findjob.Service;

import java.util.List;

import com.findjb.findjob.Model.Experience;
import com.findjb.findjob.Request.ExperienceRequest;


public interface ExperienceServiceInterface {
    void createExperience(ExperienceRequest newExperience);

    void updateExperience(ExperienceRequest updateExperience, Long id );

    List<Experience> getListExperience();

    Experience getExperienceDetail (Long id);

    void deleteExperience(Long id);
}
