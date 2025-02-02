package com.findjb.findjob.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.findjb.findjob.Model.Skill;

public interface SkillRepository extends JpaRepository<Skill , Long > {
    Skill findByName(String name);

    List<Skill> findByFreelancerId(Long id);
}
