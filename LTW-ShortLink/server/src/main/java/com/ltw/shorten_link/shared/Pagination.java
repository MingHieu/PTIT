package com.ltw.shorten_link.shared;

import java.util.List;

import lombok.Data;

@Data
public class Pagination<T> {
    public int page;

    public int per_page;

    public String query;

    public List<T> data;
}
