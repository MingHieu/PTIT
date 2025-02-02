
package com.findjb.findjob.Service.JPA;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.findjb.findjob.JWT.JWTServices.UserDetailsImplement;
import com.findjb.findjob.Model.Experience;
import com.findjb.findjob.Model.Freelancer;
import com.findjb.findjob.Repositories.ExperienceRepository;
import com.findjb.findjob.Repositories.FreelancerRepository;
import com.findjb.findjob.Request.ExperienceRequest;
import com.findjb.findjob.Service.ExperienceServiceInterface;

@Service
public class ExperienceService implements ExperienceServiceInterface {

    @Autowired
    private FreelancerRepository freelancerRepository;
    @Autowired
    private ExperienceRepository experienceRepository;

    @Override
    public void createExperience(ExperienceRequest newExperience) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
        Freelancer freelancer = freelancerRepository.findById(userDetails.getId()).get();
        Experience experience = Experience.builder().name(newExperience.getName())
                .position(newExperience.getPosition())
                .fromDate(newExperience.getFromDate())
                .toDate(newExperience.getToDate())
                .description(newExperience.getDescription())
                .freelancer(freelancer)
                .build();
        experienceRepository.save(experience);
    }

    @Override
    public void updateExperience(ExperienceRequest updateExperience, Long id) {
        Experience experience = experienceRepository.getReferenceById(id);
        experience.setName(updateExperience.getName());
        experience.setPosition(updateExperience.getPosition());
        experience.setFromDate(updateExperience.getFromDate());
        experience.setToDate(updateExperience.getToDate());
        experience.setDescription(updateExperience.getDescription());
        experienceRepository.save(experience);
    }

    @Override
    public List<Experience> getListExperience() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
        Freelancer freelancer = freelancerRepository.findById(userDetails.getId()).get();
        return experienceRepository.findByFreelancerId(freelancer.getId());
    }

    @Override
    public Experience getExperienceDetail(Long id) {
        return experienceRepository.findById(id).get();
    }

    @Override
    public void deleteExperience(Long id) {
        experienceRepository.deleteById(id);
    }
}
