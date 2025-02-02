package com.example.timviec.views;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.components.NonScrollListView;
import com.example.timviec.model.API;
import com.example.timviec.model.Job;
import com.example.timviec.services.ApiService;

import org.json.JSONObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SearchScreen extends Utils.BaseActivity {

    private EditText input;
    private NonScrollListView listView;
    private LinearLayout textWrapper;
    private TextView quantity;

    private JobListViewAdapter jobListViewAdapter;
    private ArrayList<Job> jobItems = new ArrayList<>();
    private int page = 0;
    private boolean refresh = false;
    private boolean loadingMore = false;
    private boolean eod = true;
    private LoadingDialog loadingDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_screen);

        findViewById(R.id.search_screen_back_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onBackPressed();
            }
        });

        input = findViewById(R.id.search_screen_input);
        textWrapper = findViewById(R.id.search_screen_text);
        quantity = findViewById(R.id.search_screen_quantity);

        listView = findViewById(R.id.search_screen_list);

        input.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int i, KeyEvent keyEvent) {
                if (i == EditorInfo.IME_ACTION_DONE) {
                    // hide keyboard
                    InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(input.getWindowToken(), 0);
                    getData(true);
                    return true;
                }
                return false;
            }
        });

        ScrollView scrollView = findViewById(R.id.search_screen_scroll_view);

        ViewTreeObserver.OnScrollChangedListener detectScrollToEnd = new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
                if (!scrollView.canScrollVertically(1) && !loadingMore && !eod && !refresh) {
                    Log.i(null, "Load more...");
                    getData(false);
                }
            }
        };
        scrollView.getViewTreeObserver().addOnScrollChangedListener(detectScrollToEnd);
        loadingDialog = new LoadingDialog(this);
    }

    private void getData(Boolean search) {
        if (search) {
            refresh = true;
            loadingDialog.show();
            jobItems = new ArrayList<>();
            jobListViewAdapter = new JobListViewAdapter(jobItems, JobListViewAdapter.SCREEN_TYPE.SEARCH_SCREEN);
            listView.setAdapter(jobListViewAdapter);
            quantity.setText("0");
            loadingMore = false;
            eod = false;
            page = 0;
        } else {
            loadingMore = true;
        }

        ApiService.apiService.getAllPost(false, page, input.getText().toString()).enqueue(new Callback<API.getAllPostResponse>() {
            @Override
            public void onResponse(Call<API.getAllPostResponse> call, Response<API.getAllPostResponse> response) {
                if (search) {
                    refresh = false;
                    loadingDialog.hide();
                } else {
                    loadingMore = false;
                }
                if (response.isSuccessful()) {
                    textWrapper.setVisibility(View.VISIBLE);

                    ArrayList<Job> jobs = response.body().getData();
                    if (jobs.size() == 0) {
                        eod = true;
                        return;
                    }
                    quantity.setText("" + response.body().getTotalRecordCount());
                    jobItems.addAll(jobs);
                    if (search) {
                        jobListViewAdapter = new JobListViewAdapter(jobItems, JobListViewAdapter.SCREEN_TYPE.SEARCH_SCREEN);
                        listView.setAdapter(jobListViewAdapter);
                    } else {
                        jobListViewAdapter.notifyDataSetChanged();
                    }
                    ++page;
                } else {
                    eod = true;
                    try {
                        JSONObject jsonObject = new JSONObject(response.errorBody().string());
                        CustomDialog dialog = new CustomDialog(SearchScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    } catch (Exception e) {
                        CustomDialog dialog = new CustomDialog(SearchScreen.this, e.getMessage(), null, null);
                        dialog.show();
                    }
                }
            }

            @Override
            public void onFailure(Call<API.getAllPostResponse> call, Throwable t) {
                if (search) {
                    refresh = false;
                    loadingDialog.hide();
                } else {
                    loadingMore = false;
                }
                eod = true;
                Utils.handleFailure(SearchScreen.this, t);
            }
        });
    }
}