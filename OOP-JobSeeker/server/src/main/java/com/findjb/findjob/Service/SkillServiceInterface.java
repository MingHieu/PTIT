package com.findjb.findjob.Service;

import java.util.List;

import com.findjb.findjob.Model.Skill;
import com.findjb.findjob.Request.SkillRequest;

public interface SkillServiceInterface {
    void createNewSkill(SkillRequest updateSkill);

    void updateSkill(SkillRequest UpdateSkills,Long id);

    List<Skill> getListSkill();

    Skill getDetailSkill (Long id);

    void deleteSKill(Long id);
}
