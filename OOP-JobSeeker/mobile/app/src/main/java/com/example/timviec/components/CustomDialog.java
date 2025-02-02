package com.example.timviec.components;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.example.timviec.R;

public class CustomDialog {
    AlertDialog alertDialog;
    CustomButton confirmButton;

    public CustomDialog(Activity activity, String message, @Nullable String buttonTitle, @Nullable DialogType type) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        LayoutInflater inflater = activity.getLayoutInflater();
        View view = inflater.inflate(R.layout.custom_dialog, null);

        ImageView imageView = view.findViewById(R.id.custom_dialog_icon);
        TextView textView = view.findViewById(R.id.custom_dialog_text);
        confirmButton = view.findViewById(R.id.custom_dialog_button);

        builder.setView(view);
//        builder.setCancelable(false);

        alertDialog = builder.create();
        alertDialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));


        if (type == DialogType.SUCCESS) {
            imageView.setImageDrawable(view.getResources().getDrawable(R.drawable.ic_success));
        } else if (type == DialogType.ERROR) {
            imageView.setImageDrawable(view.getResources().getDrawable(R.drawable.ic_error));
        } else if (type == DialogType.WARNING) {
            imageView.setImageDrawable(view.getResources().getDrawable(R.drawable.ic_warning));
        } else {
            imageView.setVisibility(View.GONE);
        }

        textView.setText(message);

        if (buttonTitle != null) {
            confirmButton.setButtonText(buttonTitle);
        } else {
            confirmButton.setButtonText("Xác nhận");
        }

        confirmButton.setHandleOnClick(new Runnable() {
            @Override
            public void run() {
                alertDialog.dismiss();
            }
        });
    }

    public void show() {
        alertDialog.show();
    }

    public void hide() {
        alertDialog.dismiss();
    }

    public void onConfirm(Runnable runnable) {
        setCancelable(false);
        confirmButton.setHandleOnClick(runnable);
    }

    public void setCancelable(Boolean b) {
        alertDialog.setCancelable(b);
    }

    public enum DialogType {
        SUCCESS,
        ERROR,
        WARNING
    }
}
