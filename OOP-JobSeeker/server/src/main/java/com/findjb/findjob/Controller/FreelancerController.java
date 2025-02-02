package com.findjb.findjob.Controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.findjb.findjob.Request.CreateFreelancer;
import com.findjb.findjob.Request.UpdateFreelancer;
import com.findjb.findjob.Responses.ObjectResponse;
import com.findjb.findjob.Responses.StatusResponse;
import com.findjb.findjob.Service.JPA.FreelancerService;

@RestController
@RequestMapping("/api/user")
public class FreelancerController {
    @Autowired
    private FreelancerService freelancerService;

    @PostMapping({ "/create/freelancer" })
    public ResponseEntity<Object> createNewFreelancer(@RequestBody @Valid CreateFreelancer freelancer)
            throws Exception {
        freelancerService.createNewFreelancer(freelancer);
        return new ResponseEntity<Object>(new StatusResponse(true, "Đăng kí thành công"), HttpStatus.OK);
    }

    @PutMapping("/freelancer/update")
    public ResponseEntity<Object> updateFreelancer(@RequestBody UpdateFreelancer updateFreelancer) {
        freelancerService.updateFreelancer(updateFreelancer);
        return new ResponseEntity<Object>(new StatusResponse(true, "Cập nhật thành công"), HttpStatus.OK);
    }

    @DeleteMapping("/freelancer/delete")
    public ResponseEntity<Object> deleteFreelancer() {
        freelancerService.deleteFreelancer();
        return new ResponseEntity<Object>(new StatusResponse(true, "Xóa thành công"), HttpStatus.OK);
    }

    @GetMapping("/freelancer/{id}")
    public ResponseEntity<Object> getFreelancerDetail(@PathVariable Long id) {
        return new ResponseEntity<Object>(
                new ObjectResponse(true, "Thành công", freelancerService.getFreelancerDetail(id)), HttpStatus.OK);
    }
    @GetMapping("/freelancer/getPost")
    public ResponseEntity<Object> getAllPost(){
        return new ResponseEntity<Object>(new ObjectResponse(true,"Thành công",freelancerService.getAllPostApply()), HttpStatus.OK);
    }
}
