package com.example.timviec.model;

import androidx.annotation.Nullable;

public class Experience {
    private Integer id = null;
    private String name = "";
    private String position = "";
    private String fromDate = "";
    private String toDate = "";
    private String description = "";

    public Experience() {
    }

    public Experience(@Nullable Integer id, String name, String position, String fromDate, String toDate, String description) {
        this.id = id;
        this.name = name;
        this.position = position;
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

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
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
}
