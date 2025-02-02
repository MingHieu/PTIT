package com.findjb.findjob.Responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaginateResponse {
    Boolean status;
    String message;
    Object data;
    Integer page_number;
    Integer page_size;
    Long total_record_count;
}
