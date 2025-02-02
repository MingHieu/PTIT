package com.findjb.findjob.Model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "freelancers")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Freelancer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "dob")
    private String dob;

    @Column(name = "gender")
    private Integer gender;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phone_number;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "introduction",columnDefinition = "TEXT")
    private String introduction;

    @Column(name = "level")
    private Integer level;

    @Column(name = "avatar", length = 100000)
    private String avatar;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @MapsId
    @JsonIgnore
    private User user;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "freelancer")
    private List<Education> educations;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "freelancer")
    private List<Skill> skills;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "freelancer")
    private List<Experience> experiences;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "freelancer")
    @JsonIgnore
    private List<ApplyPost> applyPosts;
}
