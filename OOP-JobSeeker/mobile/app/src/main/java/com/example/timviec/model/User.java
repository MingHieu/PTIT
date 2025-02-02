package com.example.timviec.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.Objects;

public class User {
    private int roleId;
    private UserDetail detail;

    public User() {
    }

    public User(int roleId, UserDetail detail) {
        this.roleId = roleId;
        this.detail = detail;
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public UserDetail getDetail() {
        return detail;
    }

    public void setDetail(UserDetail detail) {
        this.detail = detail;
    }

    public static class UserDetail {
        private Integer id, gender;
        private String name, dob, address, email, introduction, level, avatar;
        @SerializedName("phone_number")
        private String phoneNumber;
        private ArrayList<Education> educations;
        private ArrayList<Skill> skills;
        private ArrayList<Experience> experiences;
        @SerializedName("posts")
        private ArrayList<Job> jobs;
        private ArrayList<Job> applyJobs;

        @Override
        public boolean equals(Object o) {
            UserDetail that = (UserDetail) o;
            return Objects.equals(id, that.id);
        }

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public Integer getGender() {
            return gender;
        }

        public void setGender(Integer gender) {
            this.gender = gender;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getIntroduction() {
            return introduction;
        }

        public void setIntroduction(String introduction) {
            this.introduction = introduction;
        }

        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public String getAvatar() {
            return avatar;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public ArrayList<Education> getEducations() {
            return educations;
        }

        public void setEducations(ArrayList<Education> educations) {
            this.educations = educations;
        }

        public ArrayList<Skill> getSkills() {
            return skills;
        }

        public void setSkills(ArrayList<Skill> skills) {
            this.skills = skills;
        }

        public ArrayList<Experience> getExperiences() {
            return experiences;
        }

        public void setExperiences(ArrayList<Experience> experiences) {
            this.experiences = experiences;
        }

        public ArrayList<Job> getJobs() {
            return jobs;
        }

        public void setJobs(ArrayList<Job> jobs) {
            this.jobs = jobs;
        }

        public ArrayList<Job> getApplyJobs() {
            return applyJobs;
        }

        public void setApplyJobs(ArrayList<Job> applyJobs) {
            this.applyJobs = applyJobs;
        }
    }
}



