package com.example.timviec.views;

import android.content.Intent;
import android.os.Bundle;

import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.components.CustomButton;

public class SelectRoleScreen extends Utils.BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(com.example.timviec.R.layout.activity_select_role_screen);

        CustomButton freelancerButton = findViewById(R.id.select_role_freelancer_button);
        freelancerButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                Intent i = new Intent(SelectRoleScreen.this, LoginScreen.class);
                i.putExtra("roleId", 1);
                startActivity(i);
            }
        });

        CustomButton enterpriseButton = findViewById(R.id.select_role_enterprise_button);
        enterpriseButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                Intent i = new Intent(SelectRoleScreen.this, LoginScreen.class);
                i.putExtra("roleId", 2);
                startActivity(i);
            }
        });
    }

    @Override
    public void onBackPressed() {
        moveTaskToBack(true);
    }
}