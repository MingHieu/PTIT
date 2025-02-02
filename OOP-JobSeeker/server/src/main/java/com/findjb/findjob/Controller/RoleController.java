package com.findjb.findjob.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.findjb.findjob.Model.Role;
import com.findjb.findjob.Repositories.RoleRepository;

@RestController
@RequestMapping({ "/api" })
public class RoleController {
    @Autowired
    RoleRepository repository;

    @GetMapping({ "/role/{id}" })
    public Role getRoleByID(@PathVariable Long id) {
        Optional<Role> role = repository.findById(id);
        return role.get();
    }
}
