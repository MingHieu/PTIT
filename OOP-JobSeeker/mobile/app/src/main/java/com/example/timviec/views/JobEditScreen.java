package com.example.timviec.views;

import android.os.Bundle;
import android.util.Log;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.CustomInput;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.model.Job;
import com.example.timviec.model.User;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobEditScreen extends Utils.BaseActivity {
    private Job mJob;

    private CustomInput nameView;
    private CustomInput salaryView;
    private CustomInput typeView;
    private CustomInput quantityView;
    private RadioGroup genderView;
    private CustomInput experienceView;
    private CustomInput positionView;
    private CustomInput addressView;
    private CustomInput descriptionView;
    private CustomInput requirementView;
    private CustomInput benefitView;
    private CustomInput expiredView;

    private LoadingDialog loadingDialog;
    private CustomDialog dialog;

    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_job_edit_screen);

        setUpScreen("Công việc");

        CustomButton deleteButton = findViewById(R.id.job_edit_delete_btn);
        CustomButton approveButton = findViewById(R.id.job_edit_approve_btn);

        Bundle extras = getIntent().getExtras();

        Boolean createNew = extras.getBoolean("createNew", false);

        if (extras != null) {
            if (createNew) {
                mJob = new Job();
                deleteButton.setButtonText("Huỷ");
                approveButton.setButtonText("Thêm mới");
            } else {
                mJob = new Gson().fromJson(extras.getString("job"), new TypeToken<Job>() {
                }.getType());
            }
        }

        nameView = findViewById(R.id.job_edit_name);
        nameView.setValue(mJob.getName());

        salaryView = findViewById(R.id.job_edit_expectSalary);
        salaryView.setValue(mJob.getSalary());

        typeView = findViewById(R.id.job_edit_type);
        typeView.setSelectOption(this, new String[]{"Toàn thời gian", "Bán thời gian", "Làm việc từ xa"}, mJob.getType());

        quantityView = findViewById(R.id.job_edit_quantity);
        quantityView.setValue("" + mJob.getQuantity());

        genderView = findViewById(R.id.job_edit_gender);
        if (mJob.getGender() != null) {
            switch (mJob.getGender()) {
                case 1:
                    ((RadioButton) findViewById(R.id.job_edit_gender_male)).setChecked(true);
                    break;
                case 2:
                    ((RadioButton) findViewById(R.id.job_edit_gender_female)).setChecked(true);
                    break;
                default:
                    ((RadioButton) findViewById(R.id.job_edit_gender_none)).setChecked(true);
            }
        }

        experienceView = findViewById(R.id.job_edit_experience);
        experienceView.setSelectOption(this, new String[]{"Không yêu cầu", "Trên 1 năm", "Trên 2 năm", "Trên 3 năm", "Trên 4 năm", "Trên 5 năm",}, mJob.getExperience());

        positionView = findViewById(R.id.job_edit_position);
        positionView.setValue(mJob.getPosition());

        addressView = findViewById(R.id.job_edit_address);
        addressView.setValue(mJob.getAddress());

        descriptionView = findViewById(R.id.job_edit_description);
        descriptionView.setValue(mJob.getDescription());

        requirementView = findViewById(R.id.job_edit_requirement);
        requirementView.setValue(mJob.getRequirement());

        benefitView = findViewById(R.id.job_edit_benefit);
        benefitView.setValue(mJob.getBenefit());

        expiredView = findViewById(R.id.job_edit_expired);
        expiredView.setValue(new SimpleDateFormat("dd/MM/yyyy").format(mJob.getExpired()));

        deleteButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                if (createNew) {
                    onBackPressed();
                } else {
                    deleteJob();
                }
            }
        });

        approveButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                if (createNew) {
                    createJob();
                } else {
                    updateJob();
                }
            }
        });

        loadingDialog = new LoadingDialog(this);
    }

    private void createJob() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.createPost(getField()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(JobEditScreen.this, t);
            }
        });
    }

    private void updateJob() {
        if (!handleValidate()) return;

        loadingDialog.show();

        ApiService.apiService.updatePost(mJob.getId(), getField()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(JobEditScreen.this, t);
            }
        });
    }

    private void deleteJob() {
        loadingDialog.show();

        ApiService.apiService.deletePost(mJob.getId()).enqueue(new Callback<API.Response>() {
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
                Utils.handleFailure(JobEditScreen.this, t);
            }
        });
    }

    private API.postBody getField() {
        try {
            DateFormat originalFormat = new SimpleDateFormat("dd/MM/yyyy");
            DateFormat targetFormat = new SimpleDateFormat("yyyy-MM-dd");
            return new API.postBody(
                    mJob.getId(),
                    nameView.getValue(),
                    salaryView.getValue(),
                    typeView.getValue(),
                    experienceView.getValue(),
                    positionView.getValue(),
                    addressView.getValue(),
                    descriptionView.getValue(),
                    requirementView.getValue(),
                    benefitView.getValue(),
                    targetFormat.format(originalFormat.parse(expiredView.getValue())),
                    Integer.parseInt(quantityView.getValue()),
                    genderView.getCheckedRadioButtonId() == R.id.job_edit_gender_male ? 1 :
                            genderView.getCheckedRadioButtonId() == R.id.job_edit_gender_female ? 2 : 3);
        } catch (Exception e) {
            Log.e("DebugTag", e.getMessage());
            return null;
        }

    }

    private Boolean validateField() {
        if (Utils.checkEmptyInput(nameView.getValue())) return false;
        if (Utils.checkEmptyInput(salaryView.getValue())) return false;
        if (Utils.checkEmptyInput(typeView.getValue())) return false;
        if (Utils.checkEmptyInput(quantityView.getValue())) return false;
        if (Utils.checkEmptyInput(experienceView.getValue())) return false;
        if (Utils.checkEmptyInput(positionView.getValue())) return false;
        if (Utils.checkEmptyInput(addressView.getValue())) return false;
        if (Utils.checkEmptyInput(descriptionView.getValue())) return false;
        if (Utils.checkEmptyInput(requirementView.getValue())) return false;
        if (Utils.checkEmptyInput(benefitView.getValue())) return false;
        if (Utils.checkEmptyInput(expiredView.getValue())) return false;

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