package com.example.timviec.views;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import androidx.annotation.Nullable;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.CustomInput;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.model.User;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;
import com.github.dhaval2404.imagepicker.ImagePicker;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EnterpriseEditScreen extends Utils.BaseActivity {
    private ImageView mAvatar;
    private CustomInput mName;
    private CustomInput mAddress;
    private CustomInput mEmail;
    private CustomInput mPhoneNumber;
    private CustomInput mDescription;
    private CustomButton mCancelButton;
    private CustomButton mUpdateButton;
    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_enterprise_edit_screen);

        mAvatar = findViewById(R.id.edit_enterprise_avatar);
        String avatar = user.getDetail().getAvatar();
        if (avatar != null) {
            Utils.setBase64UrlImageView(mAvatar, avatar);
        } else {
            mAvatar.setImageResource(R.drawable.img_default_user);
        }

        ((ImageView) findViewById(R.id.edit_enterprise_avatar_edit)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ImagePicker.with(EnterpriseEditScreen.this)
                        .compress(1024)
                        .cropSquare()
                        .maxResultSize(200, 200)
                        .start();
            }
        });

        mName = findViewById(R.id.edit_enterprise_name);
        mName.setValue(user.getDetail().getName());

        mAddress = findViewById(R.id.edit_enterprise_address);
        mAddress.setValue(user.getDetail().getAddress());

        mEmail = findViewById(R.id.edit_enterprise_email);
        mEmail.setValue(user.getDetail().getEmail());

        mPhoneNumber = findViewById(R.id.edit_enterprise_phone_number);
        mPhoneNumber.setValue(user.getDetail().getPhoneNumber());

        mDescription = findViewById(R.id.edit_enterprise_description);
        mDescription.setValue(user.getDetail().getIntroduction());

        mCancelButton = findViewById(R.id.edit_enterprise_cancel_btn);
        mUpdateButton = findViewById(R.id.edit_enterprise_approve_btn);

        mCancelButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                onBackPressed();
            }
        });

        mUpdateButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                LoadingDialog loadingDialog = new LoadingDialog(EnterpriseEditScreen.this);
                loadingDialog.show();

                API.UpdateEnterpriseBody body = new API.UpdateEnterpriseBody(
                        Utils.getBase64UrlImageView(mAvatar),
                        mName.getValue(),
                        mAddress.getValue(),
                        mPhoneNumber.getValue(),
                        mDescription.getValue());
                ApiService.apiService.updateEnterprise(body).enqueue(new Callback<API.Response>() {
                    @Override
                    public void onResponse(Call<API.Response> call, Response<API.Response> response) {
                        loadingDialog.hide();
                        if (response.isSuccessful()) {
                            API.Response res = response.body();

                            user.getDetail().setAvatar(Utils.getBase64UrlImageView(mAvatar));
                            user.getDetail().setName(mName.getValue());
                            user.getDetail().setAddress(mAddress.getValue());
                            user.getDetail().setPhoneNumber(mPhoneNumber.getValue());
                            user.getDetail().setIntroduction(mDescription.getValue());

                            CustomDialog dialog = new CustomDialog(EnterpriseEditScreen.this, res.getMessage(), null, CustomDialog.DialogType.SUCCESS);
                            dialog.onConfirm(new Runnable() {
                                @Override
                                public void run() {
                                    dialog.hide();
                                    setResult(RESULT_OK);
                                    onBackPressed();
                                }
                            });
                            dialog.show();
                        } else {
                            try {
                                JSONObject jsonObject = new JSONObject(response.errorBody().string());
                                CustomDialog dialog = new CustomDialog(EnterpriseEditScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                                dialog.show();
                            } catch (Exception e) {
                                CustomDialog dialog = new CustomDialog(EnterpriseEditScreen.this, e.getMessage(), null, CustomDialog.DialogType.ERROR);
                                dialog.show();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<API.Response> call, Throwable t) {
                        loadingDialog.hide();
                        Log.e("DebugTag", t.toString());
                        CustomDialog dialog = new CustomDialog(EnterpriseEditScreen.this, t.getMessage(), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    }
                });
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == Activity.RESULT_OK) {
            Uri uri = data.getData();
            mAvatar.setImageURI(uri);
        }
    }
}