package com.example.timviec.model;

import com.google.gson.annotations.SerializedName;

import java.util.Date;
import java.util.Objects;

public class Job {
    private Integer id = null;
    private String companyAvatar = null;
    private String companyName = null;
    private String name = null;
    private String salary = null;
    private String type = null;
    private int quantity = 0;
    private Integer gender = null;
    private String experience = null;
    private String position = null;
    private String address = null;
    private String description = null;
    private String requirement = null;
    private String benefit = null;
    @SerializedName("created_at")
    private Date createAt = null;
    private Date expired = new Date();

    public Job() {
    }

    public Job(Integer id, String companyAvatar, String companyName, String name, String salary, String type, int quantity, Integer gender, String experience, String position, String address, String description, String requirement, String benefit, Date createAt, Date expired) {
        this.id = id;
        this.companyAvatar = companyAvatar;
        this.companyName = companyName;
        this.name = name;
        this.salary = salary;
        this.type = type;
        this.quantity = quantity;
        this.gender = gender;
        this.experience = experience;
        this.position = position;
        this.address = address;
        this.description = description;
        this.requirement = requirement;
        this.benefit = benefit;
        this.createAt = createAt;
        this.expired = expired;
    }

    @Override
    public boolean equals(Object o) {
        Job that = (Job) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, companyAvatar, companyName, name, salary, type, quantity, gender, experience, position, address, description, requirement, benefit, createAt, expired);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCompanyAvatar() {
        return companyAvatar;
    }

    public void setCompanyAvatar(String companyAvatar) {
        this.companyAvatar = companyAvatar;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirement() {
        return requirement;
    }

    public void setRequirement(String requirement) {
        this.requirement = requirement;
    }

    public String getBenefit() {
        return benefit;
    }

    public void setBenefit(String benefit) {
        this.benefit = benefit;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    public Date getExpired() {
        return expired;
    }

    public void setExpired(Date expired) {
        this.expired = expired;
    }
}
