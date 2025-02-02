package com.findjb.findjob.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.findjb.findjob.Model.ApplyPost;
import com.findjb.findjob.Model.CompositeKey.FreelancerPost;

public interface ApplyPostRepository extends JpaRepository<ApplyPost, FreelancerPost> {
    List<ApplyPost> findByFreelancerId(Long id);

    List<ApplyPost> findByPostId(Long id);
}
