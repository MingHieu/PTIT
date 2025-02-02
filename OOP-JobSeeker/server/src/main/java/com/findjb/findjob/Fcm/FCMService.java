package com.findjb.findjob.Fcm;

import org.springframework.stereotype.Service;

import com.findjb.findjob.Request.FcmNotification;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

@Service
public class FCMService {
    public String pushNotification(FcmNotification pnsRequest) {
        Message message = Message.builder()
                .setNotification(Notification.builder()
                    .setTitle(pnsRequest.getTitle())
                    .setBody(pnsRequest.getBody())
                    .build())
                .setToken(pnsRequest.getFcmToken())
                .build();

        String response = null;
        try {
            response = FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            e.printStackTrace();
        }
        return response;
    }
}
