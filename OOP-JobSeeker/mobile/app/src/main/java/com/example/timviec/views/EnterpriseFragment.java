package com.example.timviec.views;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.NonScrollListView;
import com.example.timviec.model.Job;
import com.example.timviec.model.User;
import com.example.timviec.services.StateManagerService;

import java.util.ArrayList;

public class EnterpriseFragment extends Utils.BaseFragment {
    ArrayList<Job> jobItems;
    JobListViewAdapter jobListViewAdapter;
    NonScrollListView jobListView;
    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();
    private ImageView avatarView;
    private TextView nameView;
    private TextView descriptionView;

    public EnterpriseFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_enterprise, container, false);

        view.findViewById(R.id.fragment_enterprise_infor_edit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getActivity(), EnterpriseEditScreen.class);
                startActivityForResult(i, REQUEST_TYPE.INFORMATION);
            }
        });

        view.findViewById(R.id.fragment_enterprise_jobs_edit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getActivity(), JobScreen.class);
                startActivityForResult(i, REQUEST_TYPE.JOB);
            }
        });

        jobListView = view.findViewById(R.id.fragment_enterprise_jobs);
        avatarView = view.findViewById(R.id.fragment_enterprise_avatar);
        nameView = view.findViewById(R.id.fragment_enterprise_name);
        descriptionView = view.findViewById(R.id.fragment_enterprise_description);

        setInformation();
        setJob();

        return view;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode != Activity.RESULT_OK) return;

        if (requestCode == REQUEST_TYPE.INFORMATION) {
            setInformation();
            return;
        }

        if (requestCode == REQUEST_TYPE.JOB) {
            setJob();
            return;
        }
    }

    private void setInformation() {
        String avatar = user.getDetail().getAvatar();
        if (avatar != null) {
            Utils.setBase64UrlImageView(avatarView, avatar);
        } else {
            avatarView.setImageResource(R.drawable.img_default_user);
        }
        nameView.setText(user.getDetail().getName());
        descriptionView.setText(user.getDetail().getIntroduction());
    }

    private void setJob() {
        jobItems = user.getDetail().getJobs();
        jobListViewAdapter = new JobListViewAdapter(jobItems, false, JobListViewAdapter.SCREEN_TYPE.ANOTHER);
        jobListView.setAdapter(jobListViewAdapter);
    }

    private interface REQUEST_TYPE {
        int INFORMATION = 0;
        int JOB = 1;
    }
}