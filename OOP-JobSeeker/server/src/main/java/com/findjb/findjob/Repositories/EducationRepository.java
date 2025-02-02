package com.findjb.findjob.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.findjb.findjob.Model.Education;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByFreelancerId(Long freelancerId);
}
