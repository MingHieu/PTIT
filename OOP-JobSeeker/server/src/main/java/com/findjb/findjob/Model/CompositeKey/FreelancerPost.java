package com.findjb.findjob.Model.CompositeKey;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
public class FreelancerPost implements Serializable {
    @Column(name = "freelancer_id")
    Long freelancer_id;
    @Column(name = "post_id")
    Long post_id;
}
