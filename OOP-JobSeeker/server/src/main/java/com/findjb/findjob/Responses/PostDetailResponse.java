package com.findjb.findjob.Responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostDetailResponse {
    Object detail;
    Object applicants;
    Object enterprise;
    Object related_post;
}
