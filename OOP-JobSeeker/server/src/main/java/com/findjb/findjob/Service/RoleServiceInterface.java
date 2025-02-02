package com.findjb.findjob.Service;

import java.util.Optional;

import com.findjb.findjob.Model.Role;

public interface RoleServiceInterface {
    public void createRole(Role role);

    public Optional<Role> getRoleByID(Long id);
}
