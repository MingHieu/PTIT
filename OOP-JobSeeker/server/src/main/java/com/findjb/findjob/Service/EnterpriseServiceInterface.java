package com.findjb.findjob.Service;

import java.util.Map;

import com.findjb.findjob.Model.Enterprise;
import com.findjb.findjob.Request.CreateEnterprise;
import com.findjb.findjob.Request.UpdateEnterprise;

public interface EnterpriseServiceInterface {
    void createNewEnterprise(CreateEnterprise newEnterprise);

    void updateEnterprise(UpdateEnterprise updateEnterprise);

    void deleteEnterprise();

    Map<String, Object> getAllEnterprise(Integer pageNo, Integer pageSize);

    Enterprise getEnterpriseDetails(Long id);

}
