package com.example.timviec.components;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.cardview.widget.CardView;

import com.example.timviec.R;


/**
 * TODO: document your custom view class.
 */
public class CustomButton extends FrameLayout {
    private String buttonText;
    private CardView mBtn;
    private CardView mBtnInner;
    private TextView mBtnText;
    private LinearLayout mLoadingView;
    private int color;

    public CustomButton(Context context) {
        super(context);
        init(null, 0);
    }

    public CustomButton(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(attrs, 0);
    }

    public CustomButton(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init(attrs, defStyle);
    }

    private void init(AttributeSet attrs, int defStyle) {
        inflate(getContext(), R.layout.sample_custom_button, this);

        // Load attributes
        final TypedArray a = getContext().obtainStyledAttributes(
                attrs, R.styleable.CustomButton, defStyle, 0);

        buttonText = a.getString(R.styleable.CustomButton_custom_button_text);
        mBtn = findViewById(R.id.custom_button_wrapper);
        mBtnInner = findViewById(R.id.custom_button_inner_wrapper);
        mBtnText = findViewById(R.id.custom_button_text);
        mBtnText.setText(buttonText);

        color = a.getColor(R.styleable.CustomButton_custom_button_color, getResources().getColor(R.color.primary));
        mBtn.setCardBackgroundColor(color);
        mBtnInner.setCardBackgroundColor(color);

        if (a.getBoolean(R.styleable.CustomButton_custom_button_round, false)) {
            mBtn.setRadius(99999);
            mBtnInner.setRadius(99999);
        }

        String type = a.getString(R.styleable.CustomButton_custom_button_type);
        if (type == null) type = "0";
        switch (type) {
            case "0":
                break;
            case "1":
                mBtnInner.setCardBackgroundColor(getResources().getColor(R.color.white));
                mBtnText.setTextColor(color);
                break;
        }

        mLoadingView = findViewById(R.id.custom_button_loading);
        mLoadingView.setVisibility(View.GONE);

        a.recycle();
    }

    public void setHandleOnClick(Runnable handleOnClick) {
        mBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                handleOnClick.run();
            }
        });
    }

    public void setButtonText(String buttonText) {
        this.buttonText = buttonText;
        mBtnText.setText(buttonText);
    }

    public void setLoading(Boolean loading) {
        if (loading) {
            mLoadingView.setVisibility(View.VISIBLE);
            mBtnText.setVisibility(View.GONE);
            mBtn.getBackground().setAlpha(102);
            mBtnInner.getBackground().setAlpha(102);
            mBtn.setClickable(false);
        } else {
            mLoadingView.setVisibility(View.GONE);
            mBtnText.setVisibility(View.VISIBLE);
            mBtn.getBackground().setAlpha(255);
            mBtnInner.getBackground().setAlpha(255);
            mBtn.setClickable(true);
        }
    }

    /**
     * @param buttonType 0 | 1
     */
    public void setButtonType(int buttonType) {
        switch (buttonType) {
            case 0:
                mBtnInner.setCardBackgroundColor(color);
                mBtnText.setTextColor(getResources().getColor(R.color.white));
                break;
            case 1:
                mBtnInner.setCardBackgroundColor(getResources().getColor(R.color.white));
                mBtnText.setTextColor(color);
                break;
        }
    }

    public void setColor(int color) {
        this.color = color;
        mBtn.setCardBackgroundColor(color);
        mBtnInner.setCardBackgroundColor(color);
    }
}