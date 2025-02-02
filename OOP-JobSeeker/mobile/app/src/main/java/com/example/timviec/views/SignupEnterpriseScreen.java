package com.example.timviec.views;


import android.os.Bundle;
import android.util.Log;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.CustomInput;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;
import com.example.timviec.services.StorageService;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SignupEnterpriseScreen extends Utils.BaseActivity {
    private final StateManagerService stateManager = App.getContext().getStateManager();
    private final StorageService storageService = App.getContext().getStorageService();
    private CustomInput mName;
    private CustomInput mAddress;
    private CustomInput mEmail;
    private CustomInput mPassword;
    private CustomInput mRepeatPassword;
    private CustomButton mSignupButton;
    private LoadingDialog loadingDialog;
    private CustomDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup_enterprise_screen);

        setUpScreen();
        mName = findViewById(R.id.sign_up_enterprise_name);
        mAddress = findViewById(R.id.sign_up_enterprise_address);
        mEmail = findViewById(R.id.sign_up_enterprise_email);
        mPassword = findViewById(R.id.sign_up_enterprise_password);
        mRepeatPassword = findViewById(R.id.sign_up_enterprise_repeat_password);

        mSignupButton = findViewById(R.id.sign_up_enterprise_button);
        mSignupButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                signup();
            }
        });

        loadingDialog = new LoadingDialog(this);
    }

    private void signup() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.createEnterprise(getField())
                .enqueue(new Callback<API.SignupEnterpriseResponse>() {
                    @Override
                    public void onResponse(Call<API.SignupEnterpriseResponse> call, Response<API.SignupEnterpriseResponse> response) {
                        loadingDialog.hide();
                        if (response.isSuccessful()) {

                            Log.i("DebugTag", response.body().toString());
                            CustomDialog dialog = new CustomDialog(SignupEnterpriseScreen.this, "Đăng kí thành công", "Đăng nhập", CustomDialog.DialogType.SUCCESS);
                            dialog.onConfirm(new Runnable() {
                                @Override
                                public void run() {
                                    onBackPressed();
                                }
                            });
                            dialog.show();
                        } else {
                            try {
                                JSONObject jsonObject = new JSONObject(response.errorBody().string());
                                CustomDialog dialog = new CustomDialog(SignupEnterpriseScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                                dialog.show();
                            } catch (Exception e) {
                                CustomDialog dialog = new CustomDialog(SignupEnterpriseScreen.this, e.getMessage(), null, null);
                                dialog.show();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<API.SignupEnterpriseResponse> call, Throwable t) {
                        loadingDialog.hide();
                        Utils.handleFailure(SignupEnterpriseScreen.this, t);
                    }
                });
    }

    private API.CreateEnterpriseBody getField() {
        return new API.CreateEnterpriseBody(
                mName.getValue(),
                mEmail.getValue(),
                mPassword.getValue(),
                mAddress.getValue(),
                stateManager.getFCMToken());
    }

    private Boolean validateField() {
        if (Utils.checkEmptyInput(mName.getValue())) return false;
        if (Utils.checkEmptyInput(mEmail.getValue())) return false;
        if (Utils.checkEmptyInput(mPassword.getValue())) return false;
        if (Utils.checkEmptyInput(mAddress.getValue())) return false;
        return !Utils.checkEmptyInput(mRepeatPassword.getValue());
    }

    private Boolean handleValidate() {
        if (!validateField()) {
            dialog = new CustomDialog(this, "Hãy diền đầy đủ thông tin", null, CustomDialog.DialogType.ERROR);
            dialog.show();
            return false;
        }

        if (!mPassword.getValue().equals(mRepeatPassword.getValue())) {
            dialog = new CustomDialog(this, "Mật khẩu không khớp", null, CustomDialog.DialogType.ERROR);
            dialog.show();
            return false;
        }

        return true;
    }


}