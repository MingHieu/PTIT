package com.findjb.findjob.Controller;

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

import com.findjb.findjob.Request.SkillRequest;
import com.findjb.findjob.Responses.ObjectResponse;
import com.findjb.findjob.Responses.StatusResponse;
import com.findjb.findjob.Service.JPA.SkillService;

@RestController
@RequestMapping("/api/skill")
public class SkillController {
    @Autowired
    SkillService skillService;

    @PostMapping("/create")
    public ResponseEntity<Object> createNewSkill(@RequestBody SkillRequest skillRequest) {
        skillService.createNewSkill(skillRequest);
        return new ResponseEntity<Object>(new StatusResponse(true, "Tạo mới thành công"), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllSkills() {
        return new ResponseEntity<Object>(
                new ObjectResponse(true, "Lấy danh sách thành công", skillService.getListSkill()),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDetailSkill(@PathVariable Long id) {
        return new ResponseEntity<Object>(
                new ObjectResponse(true, "Lấy danh sách thành công", skillService.getDetailSkill(id)),
                HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateSkill(@PathVariable Long id,
            @RequestBody SkillRequest skillRequest) {
        skillService.updateSkill(skillRequest, id);
        return new ResponseEntity<Object>(new StatusResponse(true, "Cập nhật thành công"), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteSkill(@PathVariable Long id) {
        skillService.deleteSKill(id);
        return new ResponseEntity<Object>(new StatusResponse(true, "Xóa thành công"), HttpStatus.OK);
    }
}
