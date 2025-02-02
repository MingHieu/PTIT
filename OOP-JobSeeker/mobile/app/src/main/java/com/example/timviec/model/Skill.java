package com.example.timviec.model;

import androidx.annotation.Nullable;

public class Skill {
    private Integer id = null;
    private String name = "";
    private int rating = 0;
    private String description = "";

    public Skill() {
    }

    public Skill(@Nullable Integer id, String name, int rating, String description) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
