package com.example.timviec.views;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.NonScrollListView;
import com.example.timviec.model.API;
import com.example.timviec.model.Job;
import com.example.timviec.model.User;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;

import org.json.JSONObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeFragment extends Utils.BaseFragment {
    private ArrayList<Job> jobItems;
    private JobListViewAdapter jobListViewAdapter;
    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();
    private ImageView mAvatar;
    private TextView mName;
    private NonScrollListView jobListView;
    private ScrollView scrollView;
    private SwipeRefreshLayout refreshLayout;
    private ViewTreeObserver.OnScrollChangedListener detectScrollToEnd;
    private String avatar;
    private String name;

    private boolean loadingRefresh = false;
    private boolean loadingMore = false;
    private boolean eod = false;
    private int page = 0;

    public HomeFragment() {
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
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        mAvatar = view.findViewById(R.id.fragment_home_avatar);
        mName = view.findViewById(R.id.fragment_home_name);
        jobListView = view.findViewById(R.id.fragment_home_list);
        scrollView = view.findViewById(R.id.fragment_home_loadmore);
        refreshLayout = view.findViewById(R.id.fragment_home_refresh);

        mAvatar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getActivity(), SettingScreen.class);
                startActivity(i);
            }
        });

        view.findViewById(R.id.fragment_home_search).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getActivity(), SearchScreen.class);
                startActivity(i);
            }
        });

        jobItems = new ArrayList<>();
        jobListViewAdapter = new JobListViewAdapter(jobItems, JobListViewAdapter.SCREEN_TYPE.HOME);
        jobListView.setAdapter(jobListViewAdapter);

        refreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                if (loadingRefresh) {
                    return;
                }
                Log.i(null, "Refreshing...");
                getData(true);
            }
        });

        detectScrollToEnd = new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
                if (!scrollView.canScrollVertically(1) && !loadingMore && !eod && !loadingRefresh) {
                    Log.i(null, "Load more...");
                    getData(false);
                }
            }
        };
        scrollView.getViewTreeObserver().addOnScrollChangedListener(detectScrollToEnd);

        setAvatar();

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();

        if (user.getDetail().getAvatar() != null && !user.getDetail().getAvatar().equals(avatar)) {
            setAvatar();
        }

        if (!user.getDetail().getName().equals(name)) {
            setName();
        }
    }

    private void setAvatar() {
        avatar = user.getDetail().getAvatar();
        if (avatar != null) {
            Utils.setBase64UrlImageView(mAvatar, avatar);
        } else {
            mAvatar.setImageResource(R.drawable.img_default_user);
        }
    }

    private void setName() {
        name = user.getDetail().getName();
        mName.setText(name);
    }

    private void getData(Boolean refresh) {
        Log.i("DebugTag", "getData");
        if (refresh) {
            jobItems = new ArrayList<>();
            jobListViewAdapter = new JobListViewAdapter(jobItems, JobListViewAdapter.SCREEN_TYPE.HOME);
            jobListView.setAdapter(jobListViewAdapter);
            page = 0;
            eod = false;
            loadingMore = false;
            loadingRefresh = true;
            refreshLayout.setRefreshing(true);
        } else {
            loadingMore = true;
        }

        ApiService.apiService.getAllPost(false, page, "").enqueue(new Callback<API.getAllPostResponse>() {
            @Override
            public void onResponse(Call<API.getAllPostResponse> call, Response<API.getAllPostResponse> response) {
                if (refresh) {
                    refreshLayout.setRefreshing(false);
                    loadingRefresh = false;
                } else {
                    loadingMore = false;
                }

                if (response.isSuccessful()) {
                    ArrayList<Job> jobs = response.body().getData();
                    if (jobs.size() == 0) {
                        eod = true;
                        return;
                    }
                    jobItems.addAll(jobs);
                    jobListViewAdapter.notifyDataSetChanged();
                    ++page;
                } else {
                    eod = true;
                    try {
                        JSONObject jsonObject = new JSONObject(response.errorBody().string());
                        CustomDialog dialog = new CustomDialog(getActivity(), jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    } catch (Exception e) {
                        CustomDialog dialog = new CustomDialog(getActivity(), e.getMessage(), null, null);
                        dialog.show();
                    }
                }
            }

            @Override
            public void onFailure(Call<API.getAllPostResponse> call, Throwable t) {
                if (refresh) {
                    loadingRefresh = false;
                } else {
                    loadingMore = false;
                }
                eod = true;
                Utils.handleFailure(getActivity(), t);
            }
        });
    }
}