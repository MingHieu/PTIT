package com.example.timviec.model;

import java.util.Date;

public class Notification {
    private int id;
    private String title = "";
    private String body = "";
    private Date time = new Date();
    private Boolean unread = true;

    public Notification() {
    }

    public Notification(int id, String title, String body, Date time, Boolean unread) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.time = time;
        this.unread = unread;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Boolean getUnread() {
        return unread;
    }

    public void setUnread(Boolean unread) {
        this.unread = unread;
    }
}
