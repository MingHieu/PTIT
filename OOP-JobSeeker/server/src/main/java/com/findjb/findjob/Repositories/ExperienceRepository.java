package com.findjb.findjob.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.findjb.findjob.Model.Experience;

public interface ExperienceRepository extends JpaRepository<Experience, Long>  {
    //Experience findByName(String name);
    List<Experience> findByFreelancerId(Long id);
}
