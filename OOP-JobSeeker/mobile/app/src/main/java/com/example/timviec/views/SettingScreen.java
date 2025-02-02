package com.example.timviec.views;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;

import com.example.timviec.App;
import com.example.timviec.Constant;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.services.StorageService;

public class SettingScreen extends Utils.BaseActivity {
    private CustomButton mLogoutButton;
    private AlertDialog mAlertDialog;
    private StorageService storage = App.getContext().getStorageService();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting_screen);

        setUpScreen("Cài đặt");

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        View alertDialogView = this.getLayoutInflater().inflate(R.layout.logout_dialog, null);
        builder.setView(alertDialogView);
        mAlertDialog = builder.create();
        mAlertDialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        ((CustomButton) alertDialogView.findViewById(R.id.logout_dialog_btn_cancel)).setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                mAlertDialog.dismiss();
            }
        });

        ((CustomButton) alertDialogView.findViewById(R.id.logout_dialog_btn_approve)).setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                storage.removeItem(Constant.AUTH_TOKEN);
                mAlertDialog.dismiss();
                Intent i = new Intent(SettingScreen.this, SelectRoleScreen.class);
                startActivity(i);
                finish();
            }
        });

        mLogoutButton = findViewById(R.id.setting_logout_button);
        mLogoutButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                mAlertDialog.show();
            }
        });
    }
}