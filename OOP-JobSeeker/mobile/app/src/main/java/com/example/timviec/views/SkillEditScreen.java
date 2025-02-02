package com.example.timviec.views;


import android.os.Bundle;
import android.util.Log;
import android.widget.RatingBar;

import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.CustomInput;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.model.Skill;
import com.example.timviec.services.ApiService;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class SkillEditScreen extends Utils.BaseActivity {

    private Skill mSkill;
    private CustomInput nameView;
    private RatingBar rateView;
    private CustomInput descriptionView;

    private LoadingDialog loadingDialog;
    private CustomDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_skill_edit_screen);

        setUpScreen("Kỹ năng");

        CustomButton deleteButton = findViewById(R.id.skill_edit_delete_btn);
        CustomButton approveButton = findViewById(R.id.skill_edit_approve_btn);

        Bundle extras = getIntent().getExtras();

        Boolean createNew = extras.getBoolean("createNew", false);

        if (extras != null) {
            if (createNew) {
                mSkill = new Skill();
                deleteButton.setButtonText("Huỷ");
                approveButton.setButtonText("Thêm mới");
            } else {
                mSkill = new Skill(
                        extras.getInt("id"),
                        extras.getString("name"),
                        extras.getInt("rate"),
                        extras.getString("description"));
            }
        }

        nameView = findViewById(R.id.skill_edit_name);
        nameView.setValue(mSkill.getName());

        rateView = findViewById(R.id.skill_edit_rate);
        rateView.setRating(mSkill.getRating());
        rateView.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float v, boolean b) {
                mSkill.setRating((int) v);
            }
        });

        descriptionView = findViewById(R.id.skill_edit_description);
        descriptionView.setValue(mSkill.getDescription());

        deleteButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                if (createNew) {
                    onBackPressed();
                } else {
                    deleteSkill();
                }
            }
        });

        approveButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                if (createNew) {
                    createNewSkill();
                } else {
                    updateSkill();
                }
            }
        });

        loadingDialog = new LoadingDialog(this);
    }

    private void createNewSkill() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.createSkill(getField()).enqueue(new Callback<API.Response>() {
            @Override
            public void onResponse(Call<API.Response> call, Response<API.Response> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    handleSuccess(response);
                } else {
                    handleError(response);
                }
            }

            @Override
            public void onFailure(Call<API.Response> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(SkillEditScreen.this, t);
            }
        });
    }

    private void updateSkill() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.updateSkill(getField(), mSkill.getId()).enqueue(new Callback<API.Response>() {
            @Override
            public void onResponse(Call<API.Response> call, Response<API.Response> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    handleSuccess(response);
                } else {
                    handleError(response);
                }
            }

            @Override
            public void onFailure(Call<API.Response> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(SkillEditScreen.this, t);
            }
        });
    }

    private void deleteSkill() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.deleteSkill(mSkill.getId()).enqueue(new Callback<API.Response>() {
            @Override
            public void onResponse(Call<API.Response> call, Response<API.Response> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    handleSuccess(response);
                } else {
                    handleError(response);
                }
            }

            @Override
            public void onFailure(Call<API.Response> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(SkillEditScreen.this, t);
            }
        });
    }

    private Skill getField() {
        return new Skill(
                mSkill.getId(),
                nameView.getValue(),
                (int) rateView.getRating(),
                descriptionView.getValue());
    }

    private Boolean validateField() {
        if (Utils.checkEmptyInput(nameView.getValue())) return false;

        return true;
    }

    private Boolean handleValidate() {
        if (!validateField()) {
            dialog = new CustomDialog(this, "Hãy điền đầy đủ thông tin", null, CustomDialog.DialogType.WARNING);
            dialog.show();
            return false;
        }
        return true;
    }

    private void handleSuccess(Response<API.Response> response) {
        API.Response res = response.body();
        CustomDialog dialog = new CustomDialog(this, res.getMessage(), null, CustomDialog.DialogType.SUCCESS);
        dialog.onConfirm(new Runnable() {
            @Override
            public void run() {
                dialog.hide();
                setResult(RESULT_OK);
                onBackPressed();
            }
        });
        dialog.show();
    }

    private void handleError(Response<API.Response> response) {
        try {
            Log.i("DebugTag", getField().toString());
            JSONObject jsonObject = new JSONObject(response.errorBody().string());
            CustomDialog dialog = new CustomDialog(this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
            dialog.show();
        } catch (Exception e) {
            CustomDialog dialog = new CustomDialog(this, e.getMessage(), null, null);
            dialog.show();
        }
    }
}