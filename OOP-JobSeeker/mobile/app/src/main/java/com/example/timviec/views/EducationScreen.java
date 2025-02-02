package com.example.timviec.views;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
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
import com.example.timviec.model.Education;
import com.example.timviec.model.User;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;

import org.json.JSONObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EducationScreen extends Utils.BaseActivity {
    private ArrayList<Education> educationItems;
    private EducationListViewAdapter educationListViewAdapter;
    private ListView educationListView;
    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_education_screen);

        setUpScreen("Học vấn");

        educationListView = findViewById(R.id.education_screen_list);

        findViewById(R.id.education_screen_add_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(EducationScreen.this, EducationEditScreen.class);
                i.putExtra("createNew", true);
                startActivityForResult(i, 0);
            }
        });

        setupView();
    }

    private void setupView() {
        educationItems = user.getDetail().getEducations();
        educationListViewAdapter = new EducationListViewAdapter(
                educationItems,
                (int) Utils.convertDpToPixel(10, this),
                Utils.convertDpToPixel(6, this),
                EducationListViewAdapter.SCREEN_TYPE.EDUCATION_SCREEN);
        educationListView.setAdapter(educationListViewAdapter);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode != Activity.RESULT_OK) return;
        Log.i("DebugTag", "OK");
        setResult(RESULT_OK);

        LoadingDialog loadingDialog = new LoadingDialog(this);
        loadingDialog.show();

        ApiService.apiService.getAllEducation().enqueue(new Callback<API.getAllEducationResponse>() {
            @Override
            public void onResponse(Call<API.getAllEducationResponse> call, Response<API.getAllEducationResponse> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    ArrayList<Education> educations = response.body().getData();
                    user.getDetail().setEducations(educations);
                    setupView();
                } else {
                    try {
                        JSONObject jsonObject = new JSONObject(response.errorBody().string());
                        CustomDialog dialog = new CustomDialog(EducationScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    } catch (Exception e) {
                        CustomDialog dialog = new CustomDialog(EducationScreen.this, e.getMessage(), null, null);
                        dialog.show();
                    }
                }
            }

            @Override
            public void onFailure(Call<API.getAllEducationResponse> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(EducationScreen.this, t);
            }
        });
    }
}

class EducationListViewAdapter extends BaseAdapter {
    private final ArrayList<Education> listItems;
    private int padding;
    private float radius;
    private boolean showDescription;
    private int screenType;

    public EducationListViewAdapter(ArrayList<Education> listItems, int screenType) {
        this.listItems = listItems;
        this.showDescription = false;
        this.screenType = screenType;
    }

    public EducationListViewAdapter(ArrayList<Education> listItems, int padding, float radius, int screenType) {
        this.listItems = listItems;
        this.padding = padding;
        this.radius = radius;
        this.showDescription = true;
        this.screenType = screenType;
    }

    @Override
    public int getCount() {
        return listItems.size();
    }

    @Override
    public Education getItem(int i) {
        return listItems.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        View itemView = view != null ? view : View.inflate(viewGroup.getContext(), R.layout.education_item, null);
        Education item = getItem(i);
        ((TextView) itemView.findViewById(R.id.education_item_name)).setText(item.getName());
        ((TextView) itemView.findViewById(R.id.education_item_major)).setText(item.getMajor());
        ((TextView) itemView.findViewById(R.id.education_item_time)).setText(item.getFromDate() + " - " + item.getToDate());
        if (!Utils.checkEmptyInput(item.getDescription()) && this.showDescription) {
            itemView.findViewById(R.id.education_item_description).setVisibility(View.VISIBLE);
            ((TextView) itemView.findViewById(R.id.education_item_description)).setText(item.getDescription());
        }

        if (padding > 0) {
            itemView.findViewById(R.id.education_item_wrapper).setPadding(padding, padding, padding, padding);
        }
        if (radius > 0) {
            ((CardView) itemView.findViewById(R.id.education_item)).setRadius(radius);
        }

        itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (screenType == SCREEN_TYPE.EDUCATION_SCREEN) {
                    Education item = getItem(i);
                    Intent intent = new Intent(itemView.getContext(), EducationEditScreen.class);
                    intent.putExtra("id", item.getId());
                    intent.putExtra("name", item.getName());
                    intent.putExtra("major", item.getMajor());
                    intent.putExtra("from", item.getFromDate());
                    intent.putExtra("to", item.getToDate());
                    intent.putExtra("description", item.getDescription());
                    ((Activity) itemView.getContext()).startActivityForResult(intent, 0);
                }

                if (screenType == SCREEN_TYPE.ANOTHER) {

                }
            }
        });


        return itemView;
    }

    public interface SCREEN_TYPE {
        int EDUCATION_SCREEN = 0;
        int ANOTHER = 999;
    }
}
