package com.example.timviec.model;

import androidx.annotation.Nullable;

public class Education {
    private Integer id = null;
    private String name = "";
    private String major = "";
    private String fromDate = "";
    private String toDate = "";
    private String description = "";

    public Education() {
    }

    public Education(@Nullable Integer id, String name, String major, String fromDate, String toDate, String description) {
        this.id = id;
        this.name = name;
        this.major = major;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Education{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", major='" + major + '\'' +
                ", fromDate='" + fromDate + '\'' +
                ", toDate='" + toDate + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
