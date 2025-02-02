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

import com.findjb.findjob.Request.CreateEnterprise;
import com.findjb.findjob.Request.UpdateEnterprise;
import com.findjb.findjob.Responses.ObjectResponse;
import com.findjb.findjob.Responses.StatusResponse;
import com.findjb.findjob.Service.JPA.EnterpriseService;

@RestController
@RequestMapping("/api/user")
public class EnterpriseController {
    @Autowired
    private EnterpriseService enterpriseService;

    @PostMapping({ "/create/enterprise" })
    public ResponseEntity<Object> createNewEnterprise(@Valid @RequestBody CreateEnterprise user) {
        enterpriseService.createNewEnterprise(user);
        return new ResponseEntity<Object>(new StatusResponse(true, "Tạo mới thành công"), HttpStatus.OK);
    }

    @PutMapping("/enterprise/update")
    public ResponseEntity<Object> updateEnterprise(@RequestBody UpdateEnterprise updateEnterprise) {
        enterpriseService.updateEnterprise(updateEnterprise);
        return new ResponseEntity<Object>(new StatusResponse(true, "Cập nhật thành công"), HttpStatus.OK);
    }

    @DeleteMapping("/enterprise/delete")
    public ResponseEntity<Object> deleteEnterprise() {
        enterpriseService.deleteEnterprise();
        return new ResponseEntity<Object>(new StatusResponse(true, "Xóa thành công"), HttpStatus.OK);
    }

    @GetMapping("/enterprise/{id}")
    public ResponseEntity<Object> getDetailEnterprise(@PathVariable Long id) {
        return new ResponseEntity<Object>(new ObjectResponse(true, "Thành công",
                enterpriseService.getEnterpriseDetails(id)), HttpStatus.OK);
    }
}
