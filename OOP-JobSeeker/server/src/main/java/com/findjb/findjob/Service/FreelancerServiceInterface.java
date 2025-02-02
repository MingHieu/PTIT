package com.findjb.findjob.Service;

import java.util.List;

import com.findjb.findjob.Model.Freelancer;
import com.findjb.findjob.Request.CreateFreelancer;
import com.findjb.findjob.Request.UpdateFreelancer;
import com.findjb.findjob.Responses.PostResponse;

public interface FreelancerServiceInterface {
    void createNewFreelancer(CreateFreelancer newFreelancer);

    void updateFreelancer(UpdateFreelancer updateFreelancer);

    void deleteFreelancer();

    Freelancer getFreelancerDetail(Long id);

    List<PostResponse> getAllPostApply();
}
