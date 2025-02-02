package com.example.timviec.views;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.RadioGroup;

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

public class UserEditScreen extends Utils.BaseActivity {
    private ImageView mAvatar;
    private CustomInput mName;
    private CustomInput mDob;
    private RadioGroup mGender;
    private CustomInput mAddress;
    private CustomInput mPhoneNumber;
    private CustomInput mDescription;
    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();
    private Boolean changeAvatar = false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_edit_screen);

        mAvatar = findViewById(R.id.edit_user_avatar);
        String avatar = user.getDetail().getAvatar();
        if (avatar != null) {
            Utils.setBase64UrlImageView(mAvatar, avatar);
        } else {
            mAvatar.setImageResource(R.drawable.img_default_user);
        }

        ((ImageView) findViewById(R.id.edit_user_avatar_edit)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ImagePicker.with(UserEditScreen.this)
                        .compress(1024)
                        .cropSquare()
                        .maxResultSize(200, 200)
                        .start();
            }
        });

        mName = findViewById(R.id.edit_user_name);
        mName.setValue(user.getDetail().getName());

        mDob = findViewById(R.id.edit_user_dob);
        mDob.setValue(user.getDetail().getDob());

        mGender = findViewById(R.id.edit_user_gender);
        if (user.getDetail().getGender() != null) {
            int gender = user.getDetail().getGender();
            switch (gender) {
                case 1:
                    ((RadioButton) findViewById(R.id.edit_user_gender_male)).setChecked(true);
                    break;
                case 2:
                    ((RadioButton) findViewById(R.id.edit_user_gender_female)).setChecked(true);
                    break;
                default:
            }
        }

        mAddress = findViewById(R.id.edit_user_address);
        mAddress.setValue(user.getDetail().getAddress());

        ((CustomInput) findViewById(R.id.edit_user_email)).setValue(user.getDetail().getEmail());

        mPhoneNumber = findViewById(R.id.edit_user_phone_number);
        mPhoneNumber.setValue(user.getDetail().getPhoneNumber());

        mDescription = findViewById(R.id.edit_user_description);
        mDescription.setValue(user.getDetail().getIntroduction());

        ((CustomButton) findViewById(R.id.edit_user_cancel_btn)).setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                onBackPressed();
            }
        });

        ((CustomButton) findViewById(R.id.edit_user_approve_btn)).setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                LoadingDialog loadingDialog = new LoadingDialog(UserEditScreen.this);
                loadingDialog.show();

                API.UpdateFreelancerBody body = new API.UpdateFreelancerBody(
                        changeAvatar ?
                                Utils.getBase64UrlImageView(mAvatar) :
                                user.getDetail().getAvatar(),
                        mName.getValue(),
                        mDob.getValue(),
                        mAddress.getValue(),
                        mPhoneNumber.getValue(),
                        mDescription.getValue(),
                        mGender.getCheckedRadioButtonId() == R.id.edit_user_gender_male ? 1 : 2);
                ApiService.apiService.updateFreelancer(body).enqueue(new Callback<API.Response>() {
                    @Override
                    public void onResponse(Call<API.Response> call, Response<API.Response> response) {
                        loadingDialog.hide();
                        if (response.isSuccessful()) {
                            API.Response res = response.body();

                            user.getDetail().setAvatar(Utils.getBase64UrlImageView(mAvatar));
                            user.getDetail().setName(mName.getValue());
                            user.getDetail().setDob(mDob.getValue());
                            user.getDetail().setGender(mGender.getCheckedRadioButtonId() == R.id.edit_user_gender_male ? 1 : 2);
                            user.getDetail().setAddress(mAddress.getValue());
                            user.getDetail().setPhoneNumber(mPhoneNumber.getValue());
                            user.getDetail().setIntroduction(mDescription.getValue());

                            CustomDialog dialog = new CustomDialog(UserEditScreen.this, res.getMessage(), null, CustomDialog.DialogType.SUCCESS);
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
                                CustomDialog dialog = new CustomDialog(UserEditScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                                dialog.show();
                            } catch (Exception e) {
                                CustomDialog dialog = new CustomDialog(UserEditScreen.this, e.getMessage(), null, CustomDialog.DialogType.ERROR);
                                dialog.show();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<API.Response> call, Throwable t) {
                        loadingDialog.hide();
                        Log.e("DebugTag", t.toString());
                        CustomDialog dialog = new CustomDialog(UserEditScreen.this, t.getMessage(), null, CustomDialog.DialogType.ERROR);
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
            changeAvatar = true;
        }
    }
}