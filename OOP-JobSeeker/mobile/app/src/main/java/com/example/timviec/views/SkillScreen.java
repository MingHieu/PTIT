package com.example.timviec.views;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.model.API;
import com.example.timviec.model.Skill;
import com.example.timviec.model.User;
import com.example.timviec.services.ApiService;
import com.example.timviec.services.StateManagerService;

import org.json.JSONObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SkillScreen extends Utils.BaseActivity {

    private ArrayList<Skill> skillItems;
    private SkillListViewAdapter skillListViewAdapter;
    private ListView skillListView;
    private StateManagerService stateManager = App.getContext().getStateManager();
    private User user = stateManager.getUser();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_skill_screen);

        setUpScreen("Kỹ năng");

        skillListView = findViewById(R.id.skill_screen_list);

        findViewById(R.id.skill_screen_add_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(SkillScreen.this, SkillEditScreen.class);
                i.putExtra("createNew", true);
                startActivityForResult(i, 0);
            }
        });

        setupView();
    }

    private void setupView() {
        skillItems = user.getDetail().getSkills();
        skillListViewAdapter = new SkillListViewAdapter(
                skillItems,
                (int) Utils.convertDpToPixel(10, this),
                Utils.convertDpToPixel(6, this)
                , SkillListViewAdapter.SCREEN_TYPE.SKILL_SCREEN);
        skillListView.setAdapter(skillListViewAdapter);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode != Activity.RESULT_OK) return;
        Log.i("DebugTag", "OK");
        setResult(RESULT_OK);

        LoadingDialog loadingDialog = new LoadingDialog(this);
        loadingDialog.show();

        ApiService.apiService.getAllSkill().enqueue(new Callback<API.getAllSkillResponse>() {
            @Override
            public void onResponse(Call<API.getAllSkillResponse> call, Response<API.getAllSkillResponse> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    ArrayList<Skill> skills = response.body().getData();
                    user.getDetail().setSkills(skills);
                    setupView();
                } else {
                    try {
                        JSONObject jsonObject = new JSONObject(response.errorBody().string());
                        CustomDialog dialog = new CustomDialog(SkillScreen.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    } catch (Exception e) {
                        CustomDialog dialog = new CustomDialog(SkillScreen.this, e.getMessage(), null, null);
                        dialog.show();
                    }
                }
            }

            @Override
            public void onFailure(Call<API.getAllSkillResponse> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(SkillScreen.this, t);
            }
        });
    }
}

class SkillListViewAdapter extends BaseAdapter {
    private final ArrayList<Skill> listItems;
    private int padding;
    private float radius;
    private boolean showDescription;
    private int screenType;

    public SkillListViewAdapter(ArrayList<Skill> listItems, int screenType) {
        this.listItems = listItems;
        this.showDescription = false;
        this.screenType = screenType;
    }

    public SkillListViewAdapter(ArrayList<Skill> listItems, int padding, float radius, int screenType) {
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
    public Skill getItem(int i) {
        return listItems.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        View itemView = view != null ? view : View.inflate(viewGroup.getContext(), R.layout.skill_item, null);
        Skill item = getItem(i);

        ((TextView) itemView.findViewById(R.id.skill_item_name)).setText(item.getName());
        ((RatingBar) itemView.findViewById(R.id.skill_item_rate)).setRating(item.getRating());

        if (!Utils.checkEmptyInput(item.getDescription()) && this.showDescription) {
            itemView.findViewById(R.id.skill_item_description).setVisibility(View.VISIBLE);
            ((TextView) itemView.findViewById(R.id.skill_item_description)).setText(item.getDescription());
        }

        if (padding > 0) {
            itemView.findViewById(R.id.skill_item_wrapper).setPadding(padding, padding, padding, padding);
        }
        if (radius > 0) {
            ((CardView) itemView.findViewById(R.id.skill_item)).setRadius(radius);
        }

        itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (screenType == SCREEN_TYPE.SKILL_SCREEN) {
                    Skill item = getItem(i);
                    Intent intent = new Intent(itemView.getContext(), SkillEditScreen.class);
                    intent.putExtra("id", item.getId());
                    intent.putExtra("name", item.getName());
                    intent.putExtra("rate", item.getRating());
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
        int SKILL_SCREEN = 0;
        int ANOTHER = 999;
    }
}