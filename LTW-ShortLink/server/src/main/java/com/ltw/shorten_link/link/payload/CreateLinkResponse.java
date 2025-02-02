package com.ltw.shorten_link.link.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateLinkResponse {
    private String url;
}
