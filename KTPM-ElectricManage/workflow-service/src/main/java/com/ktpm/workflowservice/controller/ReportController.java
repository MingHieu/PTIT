package com.ktpm.workflowservice.controller;

import com.ktpm.workflowservice.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue/monthly")
    public Object monthlyRevenue(@RequestParam Integer year) {
        return reportService.monthlyRevenue(year);
    }

}
