package com.findjb.findjob.Service.JPA;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.findjb.findjob.JWT.JWTServices.UserDetailsImplement;
import com.findjb.findjob.Model.Education;
import com.findjb.findjob.Model.Freelancer;
import com.findjb.findjob.Repositories.EducationRepository;
import com.findjb.findjob.Repositories.FreelancerRepository;
import com.findjb.findjob.Request.EducationRequest;
import com.findjb.findjob.Service.EducationServiceInterface;

@Service
public class EducationService implements EducationServiceInterface {
    @Autowired
    private FreelancerRepository freelancerRepository;
    @Autowired
    private EducationRepository educationRepository;

    @Override
    public void createEducation(EducationRequest educationRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
        Freelancer freelancer = freelancerRepository.findById(userDetails.getId()).get();
        Education education = Education.builder().name(educationRequest.getName())
                .major(educationRequest.getMajor())
                .fromDate(educationRequest.getFromDate())
                .toDate(educationRequest.getToDate())
                .description(educationRequest.getDescription())
                .freelancer(freelancer)
                .build();
        educationRepository.save(education);
    }

    @Override
    public void updateEducation(EducationRequest educationRequest, Long id) {
        Education education = educationRepository.findById(id).get();
        education.setName(educationRequest.getName());
        education.setMajor(educationRequest.getMajor());
        education.setFromDate(educationRequest.getFromDate());
        education.setToDate(educationRequest.getToDate());
        education.setDescription(educationRequest.getDescription());
        educationRepository.save(education);
    }

    @Override
    public List<Education> getListEducation() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
        Freelancer freelancer = freelancerRepository.findById(userDetails.getId()).get();
        return educationRepository.findByFreelancerId(freelancer.getId());
    }

    @Override
    public Education getDetailEducation(Long id) {
        return educationRepository.findById(id).get();
    }

    @Override
    public void deleteEducation(Long id) {
        educationRepository.deleteById(id);
    }

}
