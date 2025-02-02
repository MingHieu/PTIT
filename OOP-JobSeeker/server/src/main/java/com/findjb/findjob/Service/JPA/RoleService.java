package com.findjb.findjob.Service.JPA;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.findjb.findjob.Model.Role;
import com.findjb.findjob.Repositories.RoleRepository;
import com.findjb.findjob.Service.RoleServiceInterface;

public class RoleService implements RoleServiceInterface {
    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void createRole(Role role) {
        this.roleRepository.save(role);
    }

    @Override
    public Optional<Role> getRoleByID(Long id) {
        return this.roleRepository.findById(id);
    }

}
