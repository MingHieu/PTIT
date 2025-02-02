package com.example.timviec.views;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.model.Job;
import com.example.timviec.model.User;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobScreen extends Utils.BaseActivity {
    ArrayList<Job> jobItems;
    JobListViewAdapter jobListViewAdapter;
    ListView jobListView;
    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_job_screen);

        setUpScreen("Công việc");

        jobListView = findViewById(R.id.job_sceen_list);

        findViewById(R.id.job_screen_and_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(JobScreen.this, JobEditScreen.class);
                i.putExtra("createNew", true);
                startActivityForResult(i, 0);
            }
        });

        setupView();
    }

    private void setupView() {
        jobItems = user.getDetail().getJobs();
        jobListViewAdapter = new JobListViewAdapter(jobItems, JobListViewAdapter.SCREEN_TYPE.JOB_SCREEN);
        jobListView.setAdapter(jobListViewAdapter);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode != Activity.RESULT_OK) return;
        Log.i("DebugTag", "OK");
        setResult(RESULT_OK);

        LoadingDialog loadingDialog = new LoadingDialog(this);
        loadingDialog.show();

        ApiService.apiService.getAllPost(true, 0, "").enqueue(new Callback<API.getAllPostResponse>() {
            @Override
            public void onResponse(Call<API.getAllPostResponse> call, Response<API.getAllPostResponse> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    ArrayList<Job> jobs = response.body().getData();
                    user.getDetail().setJobs(jobs);
                    setupView();
                } else {
                    try {
                        JSONObject jsonObject = new JSONObject(response.errorBody().string());
                        CustomDialog dialog = new CustomDialog(JobScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    } catch (Exception e) {
                        CustomDialog dialog = new CustomDialog(JobScreen.this, e.getMessage(), null, null);
                        dialog.show();
                    }
                }
            }

            @Override
            public void onFailure(Call<API.getAllPostResponse> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(JobScreen.this, t);
            }
        });
    }
}

class JobListViewAdapter extends BaseAdapter {
    private final ArrayList<Job> listItems;
    private Boolean radius = true;
    private int screenType;

    public JobListViewAdapter(ArrayList<Job> listItems, int screenType) {
        this.listItems = listItems;
        this.screenType = screenType;
    }

    public JobListViewAdapter(ArrayList<Job> listItems, Boolean radius, int screenType) {
        this.listItems = listItems;
        this.radius = radius;
        this.screenType = screenType;
    }

    @Override
    public int getCount() {
        return listItems.size();
    }

    @Override
    public Job getItem(int i) {
        return listItems.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        View itemView = view != null ? view : View.inflate(viewGroup.getContext(), R.layout.sample_job_card, null);
        Job item = getItem(i);

        if (item.getCompanyAvatar() != null) {
            Utils.setBase64UrlImageView(itemView.findViewById(R.id.job_card_job_avatar), item.getCompanyAvatar());
        } else {
            ((ImageView) itemView.findViewById(R.id.job_card_job_avatar)).setImageResource(R.drawable.ic_company);
        }
        ((TextView) itemView.findViewById(R.id.job_card_job_name)).setText(item.getName());
        ((TextView) itemView.findViewById(R.id.job_card_job_company)).setText(item.getCompanyName());
        ((TextView) itemView.findViewById(R.id.job_card_job_money)).setText(item.getSalary());
        ((TextView) itemView.findViewById(R.id.job_card_job_address)).setText(item.getAddress());
        long daysLeft = TimeUnit.DAYS.convert(
                item.getExpired().getTime() - item.getCreateAt().getTime(),
                TimeUnit.MILLISECONDS);
        ((TextView) itemView.findViewById(R.id.job_card_job_time)).setText(
                daysLeft > 0 ?
                        "Còn " + daysLeft + " ngày để ứng tuyển" :
                        "Đã hết thời gian ứng tuyển"
        );

        if (!radius) {
            CardView cardView = itemView.findViewById(R.id.job_card);
            cardView.setRadius(0);
            cardView.setElevation(0);
        }


        itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (screenType == SCREEN_TYPE.HOME || screenType == SCREEN_TYPE.HISTORY || screenType == SCREEN_TYPE.SEARCH_SCREEN) {
                    Job item = getItem(i);
                    Intent intent = new Intent(itemView.getContext(), JobDetailScreen.class);
                    intent.putExtra("jobId", item.getId());
                    itemView.getContext().startActivity(intent);
                }

                if (screenType == SCREEN_TYPE.JOB_DETAIL) {
                    Job item = getItem(i);
                    Intent intent = new Intent(itemView.getContext(), JobDetailScreen.class);
                    intent.putExtra("jobId", item.getId());
                    itemView.getContext().startActivity(intent);
                    ((Activity) itemView.getContext()).finish();
                }

                if (screenType == SCREEN_TYPE.JOB_SCREEN) {
                    Job item = getItem(i);
                    Intent intent = new Intent(itemView.getContext(), JobEditScreen.class);
                    intent.putExtra("job", new Gson().toJson(item));
                    ((Activity) itemView.getContext()).startActivityForResult(intent, 0);
                }

                if (screenType == SCREEN_TYPE.ANOTHER) {

                }
            }
        });

        return itemView;
    }

    public interface SCREEN_TYPE {
        int HOME = 0;
        int HISTORY = 1;
        int JOB_DETAIL = 2;
        int JOB_SCREEN = 3;
        int SEARCH_SCREEN = 4;
        int ANOTHER = 999;
    }
}