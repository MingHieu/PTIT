package com.example.timviec.views;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.model.Job;


public class JobDetailInformation extends Utils.BaseFragment {
    private Job mJob;

    private Boolean showMore = false;

    public JobDetailInformation() {
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
        View view = inflater.inflate(R.layout.fragment_job_detail_information, container, false);

        // Expandable Layout
        LinearLayout generalView = view.findViewById(R.id.job_detail_information_general);
        ViewTreeObserver vto = generalView.getViewTreeObserver();
        vto.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                generalView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                int height = generalView.getMeasuredHeight();
                ViewGroup.LayoutParams generalLayout = generalView.getLayoutParams();
                generalLayout.height = height * 2 / 7;
                generalView.setLayoutParams(generalLayout);
                TextView showMoreView = view.findViewById(R.id.job_detail_information_show_more);
                showMoreView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        showMore = !showMore;
                        ViewGroup.LayoutParams generalLayout = generalView.getLayoutParams();
                        if (showMore) {
                            showMoreView.setText("Thu gọn");
                            generalLayout.height = height;
                        } else {
                            showMoreView.setText("Xem thêm");
                            generalLayout.height = height * 2 / 7;
                        }
                        generalView.setLayoutParams(generalLayout);
                    }
                });
            }
        });

        mJob = ((JobDetailScreen) getActivity()).job;

        ((TextView) view.findViewById(R.id.job_detail_information_salary)).setText(mJob.getSalary());
        ((TextView) view.findViewById(R.id.job_detail_information_working_type)).setText(mJob.getType());
        ((TextView) view.findViewById(R.id.job_detail_information_quantity)).setText("" + mJob.getQuantity());
        ((TextView) view.findViewById(R.id.job_detail_information_gender)).setText(mJob.getGender() == 1 ? "Nam" : mJob.getGender() == 2 ? "Nữ" : "Không yêu cầu");
        ((TextView) view.findViewById(R.id.job_detail_information_experience)).setText(mJob.getExperience());
        ((TextView) view.findViewById(R.id.job_detail_information_position)).setText(mJob.getPosition());
        ((TextView) view.findViewById(R.id.job_detail_information_address)).setText(mJob.getAddress());
        ((TextView) view.findViewById(R.id.job_detail_information_description)).setText(mJob.getDescription());
        ((TextView) view.findViewById(R.id.job_detail_information_requirement)).setText(mJob.getRequirement());
        ((TextView) view.findViewById(R.id.job_detail_information_benefit)).setText(mJob.getBenefit());


        return view;
    }
}