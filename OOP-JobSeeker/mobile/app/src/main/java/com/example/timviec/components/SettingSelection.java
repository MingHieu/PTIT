package com.example.timviec.components;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.timviec.R;

/**
 * TODO: document your custom view class.
 */
public class SettingSelection extends FrameLayout {
    private String mText;
    private int mIcon;

    public SettingSelection(Context context) {
        super(context);
        init(null, 0);
    }

    public SettingSelection(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(attrs, 0);
    }

    public SettingSelection(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init(attrs, defStyle);
    }

    private void init(AttributeSet attrs, int defStyle) {
        inflate(getContext(), R.layout.sample_setting_selection, this);

        // Load attributes
        final TypedArray a = getContext().obtainStyledAttributes(
                attrs, R.styleable.SettingSelection, defStyle, 0);

        mText = a.getString(R.styleable.SettingSelection_setting_selection_text);
        mIcon = a.getResourceId(R.styleable.SettingSelection_setting_selection_icon, -1);

        TextView textView = findViewById(R.id.setting_selection_title);
        textView.setText(mText);

        ImageView iconLeft = findViewById(R.id.setting_selection_icon_left);
        iconLeft.setImageResource(mIcon);

        a.recycle();
    }

}