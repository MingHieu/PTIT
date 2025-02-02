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
import com.example.timviec.model.Education;
import com.example.timviec.model.University;
import com.example.timviec.services.ApiService;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EducationEditScreen extends Utils.BaseActivity {
    private Education mEducation;

    private CustomInput nameView;
    private CustomInput majorView;
    private CustomInput fromDateView;
    private CustomInput toDateView;
    private CheckBox checkBox;
    private CustomInput descriptionView;

    private LoadingDialog loadingDialog;
    private CustomDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_education_edit_screen);

        setUpScreen("Học vấn");

        CustomButton deleteButton = findViewById(R.id.education_edit_delete_btn);
        CustomButton approveButton = findViewById(R.id.education_edit_approve_btn);

        Bundle extras = getIntent().getExtras();

        Boolean createNew = extras.getBoolean("createNew", false);

        if (extras != null) {
            if (createNew) {
                mEducation = new Education();
                deleteButton.setButtonText("Huỷ");
                approveButton.setButtonText("Thêm mới");
            } else {
                mEducation = new Education(
                        extras.getInt("id"),
                        extras.getString("name"),
                        extras.getString("major"),
                        extras.getString("from"),
                        extras.getString("to"),
                        extras.getString("description"));
            }
        }

        nameView = findViewById(R.id.education_edit_name);
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(getResources().openRawResource(R.raw.vietnam_university)));
            Gson gson = new Gson();
            University[] universities = gson.fromJson(reader, University[].class);
            ArrayList<String> universityNames = new ArrayList<>();
            for (University x : universities) {
                universityNames.add(x.getName());
            }
            nameView.setSuggestList(this, universityNames.toArray(new String[0]), mEducation.getName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        majorView = findViewById(R.id.education_edit_major);
        majorView.setValue(mEducation.getMajor());

        fromDateView = findViewById(R.id.education_edit_from_date);
        fromDateView.setValue(mEducation.getFromDate());

        toDateView = findViewById(R.id.education_edit_to_date);
        toDateView.setValue(mEducation.getToDate());

        checkBox = findViewById(R.id.education_edit_checkbox);
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
        if (mEducation.getToDate().equals("Hiện tại")) {
            checkBox.setChecked(true);
            toDateView.setValue("");
        }

        descriptionView = findViewById(R.id.education_edit_description);
        descriptionView.setValue(mEducation.getDescription());

        deleteButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                if (createNew) {
                    onBackPressed();
                } else {
                    deleteEducation();
                }
            }
        });

        approveButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                if (createNew) {
                    createNewEducation();
                } else {
                    updateEducation();
                }
            }
        });

        loadingDialog = new LoadingDialog(this);
    }

    private void createNewEducation() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.createEducation(getField()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(EducationEditScreen.this, t);
            }
        });

    }

    private void updateEducation() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.updateEducation(getField(), mEducation.getId()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(EducationEditScreen.this, t);
            }
        });
    }

    private void deleteEducation() {
        loadingDialog.show();

        ApiService.apiService.deleteEducation(mEducation.getId()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(EducationEditScreen.this, t);
            }
        });
    }

    private Education getField() {
        return new Education(
                mEducation.getId(),
                nameView.getValue(),
                majorView.getValue(),
                fromDateView.getValue(),
                checkBox.isChecked() ? "Hiện tại" : toDateView.getValue(),
                descriptionView.getValue());
    }

    private Boolean validateField() {
        if (Utils.checkEmptyInput(nameView.getValue())) return false;
        if (Utils.checkEmptyInput(majorView.getValue())) return false;
        if (Utils.checkEmptyInput(fromDateView.getValue())) return false;
        if (Utils.checkEmptyInput(toDateView.getValue()) && !checkBox.isChecked()) return false;
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