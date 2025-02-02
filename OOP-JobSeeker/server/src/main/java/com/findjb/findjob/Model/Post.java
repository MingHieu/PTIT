package com.findjb.findjob.Model;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "posts")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "address")
    private String address;
    @Column(name = "expect_salary")
    private String salary;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    @Column(name = "requirement",columnDefinition = "TEXT")
    private String requirement;
    @Column(name = "gender")
    private String gender;
    @Column(name = "position")
    private String position;
    @Column(name = "experience")
    private String experience;
    @Column(name = "type")
    private String type;
    @Column(name = "benefit",columnDefinition = "TEXT")
    private String benefit;
    @CreationTimestamp
    private Date created_at;
    @Column(name = "expired")
    private Date expired;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "enterprise_id", nullable = false)
    private Enterprise enterprise;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "post")
    @JsonIgnore
    private List<ApplyPost> applyPosts;
}
