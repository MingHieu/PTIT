package com.example.timviec.services;

import com.example.timviec.model.Notification;
import com.example.timviec.model.User;

import java.util.ArrayList;

public class StateManagerService {
    private User user;
    private String authToken;
    private String FCMToken;
    private ArrayList<Notification> notifications;

    public StateManagerService() {
        user = new User();
        authToken = "";
        FCMToken = "";
        notifications = new ArrayList<Notification>();
//        notifications.add(new Notification(1, "Test 1", "Test", new Date(), true));
//        notifications.add(new Notification(2, "Test 1", "Test", new Date(), false));
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public String getFCMToken() {
        return FCMToken;
    }

    public void setFCMToken(String FCMToken) {
        this.FCMToken = FCMToken;
    }

    public ArrayList<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(ArrayList<Notification> notifications) {
        this.notifications = notifications;
    }
}
