package com.example.timviec.views;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;
import com.example.timviec.components.CustomDialog;
import com.example.timviec.components.LoadingDialog;
import com.example.timviec.components.NonScrollListView;
import com.example.timviec.model.API;
import com.example.timviec.model.Education;
import com.example.timviec.model.Experience;
import com.example.timviec.model.Job;
import com.example.timviec.model.Skill;
import com.example.timviec.model.User;
import com.example.timviec.services.ApiService;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserPublic extends Utils.BaseActivity {
    private User.UserDetail user;

    private ArrayList<Education> educationItems;
    private EducationListViewAdapter educationListViewAdapter;
    private NonScrollListView educationListView;

    private ArrayList<Experience> experienceItems;
    private ExperienceListViewAdapter experienceListViewAdapter;
    private NonScrollListView experienceListView;

    private ArrayList<Skill> skillItems;
    private SkillListViewAdapter skillListViewAdapter;
    private NonScrollListView skillListView;

    private ImageView avatarView;
    private TextView nameView;
    private TextView descriptionView;

    private Job job;
    private User.UserDetail enterprise;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_public);

        setUpScreen("Thông tin cá nhân");

        avatarView = findViewById(R.id.user_public_avatar);
        nameView = findViewById(R.id.user_public_name);
        descriptionView = findViewById(R.id.user_public_description);
        educationListView = findViewById(R.id.user_public_education);
        experienceListView = findViewById(R.id.user_public_experience);
        skillListView = findViewById(R.id.user_public_skill);

        Bundle extras = getIntent().getExtras();
        int userId = extras.getInt("userId");

        LoadingDialog loadingDialog = new LoadingDialog(this);
        loadingDialog.show();
        ApiService.apiService.getUserPublic(userId).enqueue(new Callback<API.UserPublic>() {
            @Override
            public void onResponse(Call<API.UserPublic> call, Response<API.UserPublic> response) {
                loadingDialog.hide();
                if (response.isSuccessful()) {
                    user = response.body().getData();

                    job = new Gson().fromJson(extras.getString("job"), Job.class);
                    enterprise = new Gson().fromJson(extras.getString("enterprise"), User.UserDetail.class);

                    ((CustomButton) findViewById(R.id.user_public_message_button)).setHandleOnClick(new Runnable() {
                        @Override
                        public void run() {
                            sendEmail(user.getEmail());
                        }
                    });

                    setInformation();
                    setEducation();
                    setExperience();
                    setSkill();
                } else {
                    try {
                        JSONObject jsonObject = new JSONObject(response.errorBody().string());
                        CustomDialog dialog = new CustomDialog(UserPublic.this, jsonObject.getString("message"), null, CustomDialog.DialogType.ERROR);
                        dialog.show();
                    } catch (Exception e) {
                        CustomDialog dialog = new CustomDialog(UserPublic.this, e.getMessage(), null, null);
                        dialog.show();
                    }
                }
            }

            @Override
            public void onFailure(Call<API.UserPublic> call, Throwable t) {
                loadingDialog.hide();
                Utils.handleFailure(UserPublic.this, t);
            }
        });


    }

    public void sendEmail(String email) {
        String subject = "Thư mời phỏng vấn vị trí " + job.getName();
        String body = String.format("Dear %s,\n" + "%s có nhận được thư ứng tuyển của bạn vào vị trí %s. Sau khi có sự đánh giá sơ bộ, phòng nhân sự xin phép được sắp xếp lịch PV cho bạn như sau:\n" + "1. Thời gian: {VD: 10h00 T3 ngày 10 tháng 10 năm 2022}.\n" + "2. Hình thức phỏng vấn: {VD: Online qua Skype}\n" + "3. Địa chỉ công ty: %s\n" + "Nếu chấp nhận tham gia phỏng vấn, bạn vui lòng xác nhận lại mail cho mình nhé.\n" + "Cảm ơn bạn nhiều!", user.getName(), enterprise.getName(), job.getName(), job.getAddress());
        Uri uri = Uri.parse("mailto:").buildUpon().appendQueryParameter("to", email).appendQueryParameter("subject", subject).appendQueryParameter("body", body).build();

        Intent emailIntent = new Intent(Intent.ACTION_SENDTO, uri);
        startActivity(Intent.createChooser(emailIntent, "Gửi thông tin đến người ứng tuyển"));
    }

    private void setInformation() {
        String avatar = user.getAvatar();
        if (avatar != null) {
            Utils.setBase64UrlImageView(avatarView, avatar);
        } else {
            avatarView.setImageResource(R.drawable.img_default_user);
        }
        nameView.setText(user.getName());
        descriptionView.setText(user.getIntroduction());
    }

    private void setEducation() {
        educationItems = user.getEducations();
        educationListViewAdapter = new EducationListViewAdapter(educationItems, EducationListViewAdapter.SCREEN_TYPE.ANOTHER);
        educationListView.setAdapter(educationListViewAdapter);
    }

    private void setExperience() {
        experienceItems = user.getExperiences();
        experienceListViewAdapter = new ExperienceListViewAdapter(experienceItems, ExperienceListViewAdapter.SCREEN_TYPE.ANOTHER);
        experienceListView.setAdapter(experienceListViewAdapter);
    }

    private void setSkill() {
        skillItems = user.getSkills();
        skillListViewAdapter = new SkillListViewAdapter(skillItems, SkillListViewAdapter.SCREEN_TYPE.ANOTHER);
        skillListView.setAdapter(skillListViewAdapter);
    }
}

class UserListViewAdapter extends BaseAdapter {
    private final ArrayList<API.getPostResponse.Data.Applicant> listItems;
    private Intent intent;

    public UserListViewAdapter(ArrayList<API.getPostResponse.Data.Applicant> listItems, Intent intent) {
        this.listItems = listItems;
        this.intent = intent;
    }

    @Override
    public int getCount() {
        return listItems.size();
    }

    @Override
    public Object getItem(int i) {
        return listItems.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        View itemView = view != null ? view : View.inflate(viewGroup.getContext(), R.layout.user_item, null);
        API.getPostResponse.Data.Applicant item = (API.getPostResponse.Data.Applicant) getItem(i);

        if (item.getDetail().getAvatar() != null) {
            Utils.setBase64UrlImageView(itemView.findViewById(R.id.user_item_avatar), item.getDetail().getAvatar());
        } else {
            ((ImageView) itemView.findViewById(R.id.user_item_avatar)).setImageResource(R.drawable.img_default_user);
        }
        ((TextView) itemView.findViewById(R.id.user_item_name)).setText(item.getDetail().getName());

        itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                intent.putExtra("userId", item.getDetail().getId());
                itemView.getContext().startActivity(intent);
            }
        });

        return itemView;
    }
}