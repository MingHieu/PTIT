package com.findjb.findjob.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.findjb.findjob.Model.Enterprise;

public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    Enterprise findByName(String name);
}
