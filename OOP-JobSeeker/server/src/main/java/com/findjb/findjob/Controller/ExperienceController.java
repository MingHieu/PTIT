package com.findjb.findjob.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.findjb.findjob.Request.ExperienceRequest;
import com.findjb.findjob.Responses.ObjectResponse;
import com.findjb.findjob.Responses.StatusResponse;
import com.findjb.findjob.Service.JPA.ExperienceService;

@RestController
@RequestMapping("/api/experience")
public class ExperienceController {
    @Autowired
    ExperienceService experienceService;

    @PostMapping("/create")
    public ResponseEntity<Object> createNewExperience(@RequestBody ExperienceRequest experienceRequest) {
        experienceService.createExperience(experienceRequest);
        return new ResponseEntity<Object>(new StatusResponse(true, "Tạo mới thành công"), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllExperience() {
        return new ResponseEntity<Object>(
                new ObjectResponse(true, "Lấy danh sách thành công", experienceService.getListExperience()),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDetailExperience(@PathVariable Long id) {
        return new ResponseEntity<Object>(
                new ObjectResponse(true, "Lấy danh sách thành công", experienceService.getExperienceDetail(id)),
                HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateExperience(@PathVariable Long id,
            @RequestBody ExperienceRequest experienceRequest) {
        experienceService.updateExperience(experienceRequest, id);
        return new ResponseEntity<Object>(new StatusResponse(true, "Cập nhật thành công"), HttpStatus.OK);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Object> deleteExperience(@PathVariable Long id) {
        experienceService.deleteExperience(id);
        return new ResponseEntity<Object>(new StatusResponse(true, "Xóa thành công"), HttpStatus.OK);
    }
}
