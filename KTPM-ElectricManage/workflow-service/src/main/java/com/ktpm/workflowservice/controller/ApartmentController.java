package com.ktpm.workflowservice.controller;

import com.ktpm.workflowservice.model.Apartment;
import com.ktpm.workflowservice.service.ApartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("apartment")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;

    @PostMapping("/create")
    public Object saveApartment(@RequestBody Apartment apartment) {
        return apartmentService.saveApartment(apartment);
    }

    @GetMapping("/all")
    public Object getAllApartment(@RequestParam("ownerId") Long ownerId) {
        return apartmentService.getAllApartment(ownerId);
    }

    @GetMapping("/{id}")
    public Object getApartmentDetail(@PathVariable Long id) {
        return apartmentService.getApartmentDetail(id);
    }

}
