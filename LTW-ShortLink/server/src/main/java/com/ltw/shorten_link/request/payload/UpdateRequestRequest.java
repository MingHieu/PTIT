package com.ltw.shorten_link.request.payload;

import com.ltw.shorten_link.request.Request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRequestRequest {
    @NotNull(message = "Id is required")
    private long id;

    @NotNull(message = "Status is required")
    private Request.Status status;
}
