package com.example.timviec.views;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;

import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.CustomInput;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.model.Experience;
import com.example.timviec.services.ApiService;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExperienceEditScreen extends Utils.BaseActivity {
    private Experience mExperience;

    private CustomInput nameView;
    private CustomInput positionView;
    private CustomInput fromDateView;
    private CustomInput toDateView;
    private CheckBox checkBox;
    private CustomInput descriptionView;

    private LoadingDialog loadingDialog;
    private CustomDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_experience_edit_screen);

        setUpScreen("Kinh nghiệm");

        CustomButton deleteButton = findViewById(R.id.experience_edit_delete_btn);
        CustomButton approveButton = findViewById(R.id.experience_edit_approve_btn);

        Bundle extras = getIntent().getExtras();

        Boolean createNew = extras.getBoolean("createNew", false);

        if (extras != null) {
            if (createNew) {
                mExperience = new Experience();
                deleteButton.setButtonText("Huỷ");
                approveButton.setButtonText("Thêm mới");
            } else {
                mExperience = new Experience(
                        extras.getInt("id"),
                        extras.getString("name"),
                        extras.getString("position"),
                        extras.getString("from"),
                        extras.getString("to"),
                        extras.getString("description"));
            }
        }

        nameView = findViewById(R.id.experience_edit_name);
        nameView.setValue(mExperience.getName());

        positionView = findViewById(R.id.experience_edit_position);
        positionView.setValue(mExperience.getPosition());

        fromDateView = findViewById(R.id.experience_edit_from_date);
        fromDateView.setValue(mExperience.getFromDate());

        toDateView = findViewById(R.id.experience_edit_to_date);
        toDateView.setValue(mExperience.getToDate());

        checkBox = findViewById(R.id.experience_edit_checkbox);
        checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    toDateView.setVisibility(View.INVISIBLE);
                } else {
                    toDateView.setVisibility(View.VISIBLE);
                }
            }
        });
        if (mExperience.getToDate().equals("Hiện tại")) {
            checkBox.setChecked(true);
            toDateView.setValue("");
        }
        descriptionView = findViewById(R.id.experience_edit_description);
        descriptionView.setValue(mExperience.getDescription());


        deleteButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                if (createNew) {
                    onBackPressed();
                } else {
                    deleteExperience();
                }
            }
        });

        approveButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                if (createNew) {
                    createNewExperience();
                } else {
                    updateExperience();
                }
            }
        });

        loadingDialog = new LoadingDialog(this);
    }

    private void createNewExperience() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.createExperience(getField()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(ExperienceEditScreen.this, t);
            }
        });
    }

    private void updateExperience() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.updateExperience(getField(), mExperience.getId()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(ExperienceEditScreen.this, t);
            }
        });
    }

    private void deleteExperience() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.deleteExperience(mExperience.getId()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(ExperienceEditScreen.this, t);
            }
        });
    }


    private Experience getField() {
        return new Experience(
                mExperience.getId(),
                nameView.getValue(),
                positionView.getValue(),
                fromDateView.getValue(),
                checkBox.isChecked() ? "Hiện tại" : toDateView.getValue(),
                descriptionView.getValue());
    }

    private Boolean vaidateField() {
        if (Utils.checkEmptyInput(nameView.getValue())) return false;
        if (Utils.checkEmptyInput(positionView.getValue())) return false;
        if (Utils.checkEmptyInput(fromDateView.getValue())) return false;
        return !Utils.checkEmptyInput(toDateView.getValue()) || checkBox.isChecked();
    }

    private Boolean handleValidate() {
        if (!vaidateField()) {
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