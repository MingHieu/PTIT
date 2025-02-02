package com.example.timviec.views;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.model.Job;
import com.example.timviec.model.User;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

import org.json.JSONObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobDetailScreen extends Utils.BaseActivity {

    public Job job;
    public User.UserDetail enterprise;
    public ArrayList<Job> relatedJob;
    public ArrayList<API.getPostResponse.Data.Applicant> applicants;
    LoadingDialog loadingDialog;
    private TabLayout mTabLayout;
    private ViewPager2 mViewPager;
    private StateManagerService stateManager = App.getContext().getStateManager();
    private boolean applyPost = false;
    private CustomButton applyButton;
    private CustomButton messageButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_job_detail);

        setUpScreen("Chi tiết việc làm");

        mTabLayout = findViewById(R.id.job_detail_tab);
        mViewPager = findViewById(R.id.job_detail_view_pager);

        if (stateManager.getUser().getRoleId() == 2) {
            findViewById(R.id.job_detail_button_wrapper).setVisibility(View.GONE);
        } else {
            messageButton = findViewById(R.id.job_detail_message_button);
            applyButton = findViewById(R.id.job_detail_apply_button);

            messageButton.setHandleOnClick(new Runnable() {
                @Override
                public void run() {
                    sendEmail("test@gmail.com");
                }
            });

            applyButton.setHandleOnClick(new Runnable() {
                @Override
                public void run() {
                    handleApplyButton();
                }
            });
        }

        Bundle extras = getIntent().getExtras();
        int jobId = extras.getInt("jobId");

        loadingDialog = new LoadingDialog(this);
        loadingDialog.show();

        ApiService.apiService.getDetailPost(jobId).enqueue(new Callback<API.getPostResponse>() {
            @Override
            public void onResponse(Call<API.getPostResponse> call, Response<API.getPostResponse> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    API.getPostResponse res = response.body();

                    job = res.getData().getJob();
                    enterprise = res.getData().getEnterprise();
                    relatedJob = res.getData().getRelatedJob();
                    job.setCompanyName(enterprise.getName());
                    job.setCompanyAvatar(enterprise.getAvatar());
                    for (Job x : relatedJob) {
                        x.setCompanyName(enterprise.getName());
                        x.setCompanyAvatar(enterprise.getAvatar());
                    }
                    applicants = res.getData().getApplicants();

                    for (Job x : stateManager.getUser().getDetail().getApplyJobs()) {
                        if (x.equals(job)) {
                            applyPost = true;
                            break;
                        }
                    }

                    if (stateManager.getUser().getRoleId() == 1) {
                        if (applyPost) {
                            applyButton.setButtonType(1);
                            applyButton.setButtonText("Đã ứng tuyển");
                        } else {
                            applyButton.setButtonType(0);
                            applyButton.setButtonText("Ứng tuyển");
                        }
                    }

                    setupView();
                    setUpTabView();

                } else {
                    try {
                        JSONObject jsonObject = new JSONObject(response.errorBody().string());
                        CustomDialog dialog = new CustomDialog(JobDetailScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    } catch (Exception e) {
                        CustomDialog dialog = new CustomDialog(JobDetailScreen.this, e.getMessage(), null, null);
                        dialog.show();
                    }
                }
            }

            @Override
            public void onFailure(Call<API.getPostResponse> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(JobDetailScreen.this, t);
            }
        });
    }

    private void setupView() {
        if (enterprise.getAvatar() != null) {
            Utils.setBase64UrlImageView(findViewById(R.id.job_detail_company_logo), enterprise.getAvatar());
        } else {
            ((ImageView) findViewById(R.id.job_detail_company_logo)).setImageResource(R.drawable.ic_company);
        }
        ((TextView) findViewById(R.id.job_detail_job_name)).setText(job.getName());
        ((TextView) findViewById(R.id.job_detail_company_name)).setText(enterprise.getName());
    }

    private void setUpTabView() {
        View child = mViewPager.getChildAt(0);
        if (child instanceof RecyclerView) {
            child.setOverScrollMode(View.OVER_SCROLL_NEVER);
        }
        JobDetailAdapter adapter = new JobDetailAdapter(this);
        mViewPager.setAdapter(adapter);
        new TabLayoutMediator(mTabLayout, mViewPager, (tab, position) -> {
            switch (position) {
                case 0:
                    tab.setText("Thông tin");
                    break;
                case 1:
                    tab.setText("Công ty");
                    break;
            }
        }).attach();
    }

    private void handleApplyButton() {
        if (applyPost) return;

        loadingDialog.show();
        ApiService.apiService.applyPost(job.getId()).enqueue(new Callback<API.Response>() {
            @Override
            public void onResponse(Call<API.Response> call, Response<API.Response> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    applyPost = true;
                    applyButton.setButtonType(1);
                    applyButton.setButtonText("Đã ứng tuyển");
                    stateManager.getUser().getDetail().getApplyJobs().add(job);
                } else {
                    try {
                        JSONObject jsonObject = new JSONObject(response.errorBody().string());
                        CustomDialog dialog = new CustomDialog(JobDetailScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    } catch (Exception e) {
                        CustomDialog dialog = new CustomDialog(JobDetailScreen.this, e.getMessage(), null, null);
                        dialog.show();
                    }
                }
            }

            @Override
            public void onFailure(Call<API.Response> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(JobDetailScreen.this, t);
            }
        });
    }

    public void sendEmail(String email) {
        String subject = "Thắc mắc về bài tuyển dụng";
        String body = String.format("Dear %s", enterprise.getName());
        Uri uri = Uri.parse("mailto:").buildUpon().appendQueryParameter("to", email).appendQueryParameter("subject", subject).appendQueryParameter("body", body).build();

        Intent emailIntent = new Intent(Intent.ACTION_SENDTO, uri);
        startActivity(Intent.createChooser(emailIntent, "Gửi thắc mắc tới nhà tuyển dụng"));
    }
}

class JobDetailAdapter extends FragmentStateAdapter {

    public JobDetailAdapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new JobDetailInformation();
            case 1:
                return new JobDetailCompany();
            default:
                return new HomeFragment();
        }
    }

    @Override
    public int getItemCount() {
        return 2;
    }
}