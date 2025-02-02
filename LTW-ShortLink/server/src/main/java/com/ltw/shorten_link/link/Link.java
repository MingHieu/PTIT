package com.ltw.shorten_link.link;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ltw.shorten_link.click.Click;
import com.ltw.shorten_link.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "links")
@EntityListeners(AuditingEntityListener.class)
public class Link {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @Column(name = "title")
    private String title;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "is_affiliate")
    private boolean isAffiliate = false;

    @Column(name = "expected_clicks")
    private Long expectedClicks;

    @Column(name = "money")
    private Long money;

    @OneToMany(mappedBy = "link")
    private List<Click> clicks;

    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username")
    private User user;

    @ManyToMany
    @JsonBackReference
    private Set<User> usersAffiliated = new HashSet<User>();

    @JsonProperty(value = "clicks")
    private long countClicks() {
        return clicks.size();
    }
}
