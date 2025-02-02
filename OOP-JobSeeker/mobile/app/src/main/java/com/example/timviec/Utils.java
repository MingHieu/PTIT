package com.example.timviec;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Rect;
import android.os.Bundle;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.example.timviec.components.CustomDialog;

import java.io.ByteArrayOutputStream;

public class Utils {
    /**
     * This method converts dp unit to equivalent pixels, depending on device density.
     *
     * @param dp      A value in dp (density independent pixels) unit. Which we need to convert into pixels
     * @param context Context to get resources and device specific display metrics
     * @return A float value to represent px equivalent to dp depending on device density
     */
    public static float convertDpToPixel(float dp, Context context) {
        return dp * ((float) context.getResources().getDisplayMetrics().densityDpi / DisplayMetrics.DENSITY_DEFAULT);
    }

    /**
     * This method converts device specific pixels to density independent pixels.
     *
     * @param px      A value in px (pixels) unit. Which we need to convert into db
     * @param context Context to get resources and device specific display metrics
     * @return A float value to represent dp equivalent to px value
     */
    public static float convertPixelsToDp(float px, Context context) {
        return px / ((float) context.getResources().getDisplayMetrics().densityDpi / DisplayMetrics.DENSITY_DEFAULT);
    }

    public static void setBase64UrlImageView(ImageView imageView, String base64Url) {
        byte[] imageAsBytes = Base64.decode(base64Url.getBytes(), Base64.DEFAULT);
        imageView.setImageBitmap(BitmapFactory.decodeByteArray(imageAsBytes, 0, imageAsBytes.length));
    }

    public static String getBase64UrlImageView(ImageView imageView) {
        imageView.buildDrawingCache();
        Bitmap bitmap = imageView.getDrawingCache();
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, stream);
        byte[] imageByteArray = stream.toByteArray();
        String img_str = Base64.encodeToString(imageByteArray, 0);
        return img_str;
    }

    public static void handleFailure(Activity activity, Throwable t) {
        Log.e("DebugTag", t.toString());
        CustomDialog dialog = new CustomDialog(activity, t.getMessage(), null, CustomDialog.DialogType.ERROR);
        dialog.show();
    }

    public static Boolean checkEmptyInput(String input) {
        if (input == null) return true;
        if (input.equals("")) return true;
        return false;
    }

    static public class BaseActivity extends AppCompatActivity {

        @Override
        protected void onCreate(@Nullable Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }

        // Hide keyboard when press outside EditText
        @Override
        public boolean dispatchTouchEvent(MotionEvent event) {
            if (event.getAction() == MotionEvent.ACTION_DOWN) {
                View v = getCurrentFocus();
                if (v instanceof EditText) {
                    Rect outRect = new Rect();
                    v.getGlobalVisibleRect(outRect);
                    if (!outRect.contains((int) event.getRawX(), (int) event.getRawY())) {
                        v.clearFocus();
                        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                        imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                    }
                }
            }
            return super.dispatchTouchEvent(event);
        }

        @Override
        public void onBackPressed() {
            super.onBackPressed();
            overridePendingTransition(0, R.anim.slide_out_right);
        }

        @Override
        public void startActivity(Intent intent) {
            super.startActivity(intent);
            overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_left);
        }

        @Override
        public void startActivityForResult(Intent intent, int requestCode) {
            super.startActivityForResult(intent, requestCode);
            overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_left);
        }

        public void setUpScreen(String screenTitle) {
            TextView actionBarTitle = findViewById(R.id.action_bar_title);
            if (actionBarTitle != null) {
                actionBarTitle.setText(screenTitle);
            }

            ImageView actionBarBackButton = findViewById(R.id.action_bar_back_button);
            if (actionBarBackButton != null) {
                actionBarBackButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        onBackPressed();
                    }
                });
            }
        }

        public void setUpScreen() {
            TextView actionBarTitle = findViewById(R.id.action_bar_title);
            if (actionBarTitle != null) {
                actionBarTitle.setVisibility(View.GONE);
            }

            ImageView actionBarBackButton = findViewById(R.id.action_bar_back_button);
            if (actionBarBackButton != null) {
                actionBarBackButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        onBackPressed();
                    }
                });
            }

            LinearLayout actionBarBorder = findViewById(R.id.action_bar_border);
            if (actionBarBorder != null) {
                actionBarBorder.setVisibility(View.GONE);
            }
        }
    }

    static public class BaseFragment extends Fragment {
        @Override
        public void startActivity(Intent intent) {
            super.startActivity(intent);
            getActivity().overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_left);
        }

        @Override
        public void startActivityForResult(Intent intent, int requestCode) {
            super.startActivityForResult(intent, requestCode);
            getActivity().overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_left);
        }

        public void setUpScreen(View view, String screenTitle) {
            TextView actionBarTitle = view.findViewById(R.id.action_bar_title);
            if (actionBarTitle != null) {
                actionBarTitle.setText(screenTitle);
            }

            ImageView actionBarBackButton = view.findViewById(R.id.action_bar_back_button);
            if (actionBarBackButton != null) {
                actionBarBackButton.setVisibility(View.GONE);
            }
        }
    }
}

