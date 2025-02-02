package com.example.timviec.services;

import android.content.Context;
import android.content.SharedPreferences;

public class StorageService {
    private SharedPreferences sharedPref;

    public StorageService(Context context) {
        sharedPref = context.getSharedPreferences("com.example.timviec", Context.MODE_PRIVATE);
    }

    public void removeItem(String key) {
        sharedPref.edit().remove(key).apply();
    }

    public void setString(String key, String value) {
        sharedPref.edit().putString(key, value).apply();
    }

    public String getString(String key) {
        return sharedPref.getString(key, null);
    }

    public void setBoolean(String key, Boolean value) {
        sharedPref.edit().putBoolean(key, value).apply();
    }

    public Boolean getBoolean(String key) {
        return sharedPref.getBoolean(key, false);
    }

    public void setLong(String key, long value) {
        sharedPref.edit().putLong(key, value).apply();
    }

    public long getLong(String key) {
        return sharedPref.getLong(key, 0);
    }

    public void setFloat(String key, Float value) {
        sharedPref.edit().putFloat(key, value).apply();
    }

    public float getFloat(String key) {
        return sharedPref.getFloat(key, 0);
    }
}
