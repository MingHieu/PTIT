package com.example.timviec.views;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.TextView;

import androidx.viewpager2.widget.ViewPager2;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.model.Job;
import com.example.timviec.model.User;
import com.example.timviec.services.StateManagerService;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;

public class HistoryFragment extends Utils.BaseFragment {

    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();

    public HistoryFragment() {
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
        View view = inflater.inflate(R.layout.fragment_history, container, false);

        setUpScreen(view, "Lịch sử");

        ListView listView = view.findViewById(R.id.fragment_history_list);
        TextView emptyTitle = view.findViewById(R.id.fragment_history_empty_title);
        TextView emptyDescription = view.findViewById(R.id.fragment_history_empty_description);
        CustomButton button = view.findViewById(R.id.fragment_history_button);
        ArrayList<Job> jobs = new ArrayList<>();

        if (user.getRoleId() == 1) {
            jobs = user.getDetail().getApplyJobs();
        }
        if (user.getRoleId() == 2) {
            jobs = user.getDetail().getJobs();
        }

        if (jobs.size() > 0) {
            JobListViewAdapter jobListViewAdapter = new JobListViewAdapter(jobs, JobListViewAdapter.SCREEN_TYPE.HISTORY);
            listView.setAdapter(jobListViewAdapter);

            view.findViewById(R.id.fragment_history_empty).setVisibility(View.GONE);
        } else {
            listView.setVisibility(View.GONE);
            if (user.getRoleId() == 1) {
                emptyTitle.setText("Lịch sử ứng tuyển");
                emptyDescription.setText("Hàng ngàn cơ hội việc làm đang chào đón.\nBạn hãy ứng tuyển để tìm kiếm cơ hội việc làm ngay nhé.");
                button.setButtonText("Tìm việc ngay");
                button.setHandleOnClick(new Runnable() {
                    @Override
                    public void run() {
                        BottomNavigationView bottomTab = getActivity().findViewById(R.id.bottom_tab);
                        ViewPager2 vp = getActivity().findViewById(R.id.bottom_tab_view_pager);
                        vp.setCurrentItem(0);
                        bottomTab.setSelectedItemId(R.id.home_screen);
                    }
                });
            }
            if (user.getRoleId() == 2) {
                emptyTitle.setText("Lịch sử tuyển dụng");
                emptyDescription.setText("Vẫn chưa có bài tuyển dụng nào.\nBạn hãy đăng các bài tuyển dụng mới để tìm kiếm nhân sự nhé.");
                button.setButtonText("Tạo bài tuyển dụng");
                button.setHandleOnClick(new Runnable() {
                    @Override
                    public void run() {
                        BottomNavigationView bottomTab = getActivity().findViewById(R.id.bottom_tab);
                        ViewPager2 vp = getActivity().findViewById(R.id.bottom_tab_view_pager);
                        vp.setCurrentItem(3);
                        bottomTab.setSelectedItemId(R.id.user_screen);
                    }
                });
            }
        }

        return view;
    }
}