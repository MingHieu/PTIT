package com.ltw.shorten_link.request.payload;

import com.ltw.shorten_link.request.Request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRequestRequest {
    @NotNull(message = "Type is required")
    private Request.Type type;

    @NotNull(message = "Value is required")
    private int value;
}
