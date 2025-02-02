package com.example.timviec;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

import com.example.timviec.services.StateManagerService;
import com.example.timviec.services.StorageService;

public class App extends Application {
    private static App mContext;
    private StateManagerService stateManager;
    private StorageService storageService;

    public static App getContext() {
        return mContext;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mContext = this;
        stateManager = new StateManagerService();
        storageService = new StorageService(this);
        createNotificationChannel();
    }

    public StateManagerService getStateManager() {
        return stateManager;
    }

    public StorageService getStorageService() {
        return storageService;
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String CHANNEL_ID = "com.example.timviec";
            CharSequence name = "TimViec";
            String description = "";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}

