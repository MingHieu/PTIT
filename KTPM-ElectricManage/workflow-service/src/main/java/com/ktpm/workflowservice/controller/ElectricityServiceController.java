package com.ktpm.workflowservice.controller;

import com.ktpm.workflowservice.service.ElectricityServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("electricity-service")
@RequiredArgsConstructor
public class ElectricityServiceController {

    private final ElectricityServiceService electricityServiceService;

    @GetMapping("/all")
    public Object getAllElectricityService(@RequestParam("name") String name) {
        return electricityServiceService.getAllServices(name);
    }

    @GetMapping("/all-by-id-in")
    public Object getAllElectricityServiceByIdIn(@RequestParam("ids") List<Long> ids) {
        return electricityServiceService.getAllServicesByIdIn(ids);
    }

}
