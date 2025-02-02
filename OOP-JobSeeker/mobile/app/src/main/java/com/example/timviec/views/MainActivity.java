package com.example.timviec.views;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.example.timviec.App;
import com.example.timviec.BuildConfig;
import com.example.timviec.Constant;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.model.Job;
import com.example.timviec.model.User;
import com.example.timviec.router.BottomTab;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;
import com.example.timviec.services.StorageService;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class MainActivity extends Utils.BaseActivity {

    private StateManagerService stateManager = App.getContext().getStateManager();
    private StorageService storageService = App.getContext().getStorageService();
    private LoadingDialog loadingDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!isTaskRoot()) {
            finish();
            return;
        }
        setContentView(R.layout.activity_main);
        String versionName = BuildConfig.VERSION_NAME;
        ((TextView) findViewById(R.id.main_activity_version)).setText("Phiên bản " + versionName);

        loadingDialog = new LoadingDialog(MainActivity.this);

        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        loadingDialog.show();
                    }
                });

                getFCMToken();
                checkAlreadyLogin();
            }
        }, 1000);
    }

    private void getFCMToken() {
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Log.i("DebugTag", "Fetching FCM registration token failed", task.getException());
                            return;
                        }

                        // Get new FCM registration token
                        String token = task.getResult();
                        Log.i("DebugTag", "FCM Token: " + token);
                        stateManager.setFCMToken(token);
                    }
                });

        FirebaseMessaging.getInstance().subscribeToTopic("all").addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                if (!task.isSuccessful()) {
                    Log.i("DebugTag", "Subscribe to FCM topic failed", task.getException());
                    return;
                }
                Log.i("DebugTag", "Subscribe to FCM topic: " + task.getResult());
            }
        });
    }

    private void checkAlreadyLogin() {
        String authToken = storageService.getString(Constant.AUTH_TOKEN);
        Log.i("DebugTag", "Authentication token: " + authToken);
        if (authToken != null) {
            stateManager.setAuthToken(authToken);
            ApiService.apiService.getUserDetail().enqueue(new Callback<API.UserDetailResponse>() {
                @Override
                public void onResponse(Call<API.UserDetailResponse> call, Response<API.UserDetailResponse> response) {
                    if (response.isSuccessful()) {
                        API.UserDetailResponse res = response.body();
                        API.UserDetailResponse.UserDetailResponseData data = res.getData();

                        User user = stateManager.getUser();
                        user.setDetail(data.getDetail());
                        user.setRoleId(data.getRole());

                        if (data.getRole() == 2) {
                            for (Job job : user.getDetail().getJobs()) {
                                job.setCompanyAvatar(user.getDetail().getAvatar());
                                job.setCompanyName(user.getDetail().getName());
                            }
                        }

                        goToHome();
                    } else {
                        try {
                            JSONObject jsonObject = new JSONObject(response.errorBody().string());
                            Log.e("DebugTag", jsonObject.getString("message"));
                            goToLogin();
                        } catch (Exception e) {
                            Log.e("DebugTag", e.getMessage());
                            goToLogin();
                        }
                    }
                }

                @Override
                public void onFailure(Call<API.UserDetailResponse> call, Throwable t) {
                    Log.e("DebugTag", t.toString());
                    goToLogin();
                }
            });
        } else {
            goToLogin();
        }
    }

    private void goToLogin() {
        loadingDialog.hide();
        Intent i = new Intent(this, SelectRoleScreen.class);
        startActivity(i);
        finish();
    }

    private void goToHome() {
        loadingDialog.hide();
        Intent i = new Intent(this, BottomTab.class);
        startActivity(i);
        finish();
    }
}