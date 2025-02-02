package com.findjb.findjob.Model;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

import com.findjb.findjob.Model.CompositeKey.FreelancerPost;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "apply_posts")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplyPost {
    @EmbeddedId
    private FreelancerPost id;

    @ManyToOne
    @MapsId("freelancer_id")
    @JoinColumn(name = "freelancer_id",nullable = false)
    private Freelancer freelancer;

    @ManyToOne
    @MapsId("post_id")
    @JoinColumn(name = "post_id",nullable = false)
    private Post post;

    @Column(name = "status")
    private Integer status;
}
