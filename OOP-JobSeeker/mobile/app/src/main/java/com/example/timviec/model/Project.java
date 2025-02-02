package com.example.timviec.model;

public class Project {
    private String name = "";
    private String type = "";
    private String finishTime = "";
    private String detail = "";
    private String projectUrl = "";

    public Project() {
    }

    public Project(String name, String type, String finishTime, String detail, String projectUrl) {
        this.name = name;
        this.type = type;
        this.finishTime = finishTime;
        this.detail = detail;
        this.projectUrl = projectUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFinishTime() {
        return finishTime;
    }

    public void setFinishTime(String finishTime) {
        this.finishTime = finishTime;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }
}
