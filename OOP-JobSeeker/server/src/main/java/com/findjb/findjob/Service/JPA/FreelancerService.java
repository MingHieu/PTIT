package com.findjb.findjob.Service.JPA;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.findjb.findjob.JWT.JWTServices.UserDetailsImplement;
import com.findjb.findjob.Model.ApplyPost;
import com.findjb.findjob.Model.Enterprise;
import com.findjb.findjob.Model.Freelancer;
import com.findjb.findjob.Model.Post;
import com.findjb.findjob.Model.Role;
import com.findjb.findjob.Model.User;
import com.findjb.findjob.Repositories.ApplyPostRepository;
import com.findjb.findjob.Repositories.FreelancerRepository;
import com.findjb.findjob.Repositories.PostRepository;
import com.findjb.findjob.Repositories.RoleRepository;
import com.findjb.findjob.Repositories.UserRepository;
import com.findjb.findjob.Request.CreateFreelancer;
import com.findjb.findjob.Request.UpdateFreelancer;
import com.findjb.findjob.Responses.PostResponse;
import com.findjb.findjob.Service.FreelancerServiceInterface;

@Service
public class FreelancerService implements FreelancerServiceInterface {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private FreelancerRepository freelancerRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private ApplyPostRepository applyPostRepository;

    @Override
    public void createNewFreelancer(CreateFreelancer newFreelancer) {
        Optional<Role> role = this.roleRepository.findById(1L);
        Role freelancerRole = role.get();
        User user = User.builder().username(newFreelancer.getEmail())
                .password(this.passwordEncoder.encode(newFreelancer.getPassword()))
                .fcmToken(newFreelancer.getFcmToken())
                .role(freelancerRole)
                .build();
        userRepository.save(user);
        Freelancer freelancer = Freelancer.builder()
                .name(newFreelancer.getName())
                .email(newFreelancer.getEmail())
                .user(user)
                .build();
        freelancerRepository.save(freelancer);
    }

    @Override
    public void updateFreelancer(UpdateFreelancer updateFreelancer) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
        Freelancer freelancer = freelancerRepository.getReferenceById(userDetails.getId());
        freelancer.setAddress(updateFreelancer.getAddress());
        freelancer.setName(updateFreelancer.getName());
        freelancer.setDob(updateFreelancer.getDob());
        freelancer.setGender(updateFreelancer.getGender());
        freelancer.setPhone_number(updateFreelancer.getPhone_number());
        freelancer.setIntroduction(updateFreelancer.getIntroduction());
        freelancer.setLevel(updateFreelancer.getLevel());
        freelancer.setAvatar(updateFreelancer.getAvatar());
        freelancerRepository.save(freelancer);
    }

    @Override
    public void deleteFreelancer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
        freelancerRepository.deleteById(userDetails.getId());
    }

    @Override
    public Freelancer getFreelancerDetail(Long id) {
        return freelancerRepository.findById(id).get();
    }

    @Override
    public List<PostResponse> getAllPostApply() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
        List<ApplyPost> apply = applyPostRepository.findByFreelancerId(userDetails.getId());
        List<PostResponse> posts = new ArrayList<>();
        for (ApplyPost a : apply) {
            Post p = postRepository.findById(a.getPost().getId()).get();
            Enterprise e = p.getEnterprise();
            PostResponse ps = PostResponse.builder()
                    .id(p.getId())
                    .name(p.getName())
                    .companyName(e.getName())
                    .companyAvatar(e.getAvatar())
                    .salary(p.getSalary())
                    .type(p.getType())
                    .quantity(p.getQuantity())
                    .experience(p.getExperience())
                    .position(p.getPosition())
                    .address(p.getAddress())
                    .description(p.getDescription())
                    .requirement(p.getRequirement())
                    .gender(p.getGender())
                    .benefit(p.getBenefit())
                    .created_at(p.getCreated_at())
                    .expired(p.getExpired())
                    .build();
            posts.add(ps);
        }
        return posts;
    }
}
