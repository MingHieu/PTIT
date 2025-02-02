package com.ltw.shorten_link.link.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateLinkRequest {
    private String title;

    @NotBlank(message = "URL is required")
    private String url;

    private Boolean isAffiliate = false;

    private Long expectedClicks;

    private Long money;
}
