package com.ltw.shorten_link.user;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ltw.shorten_link.link.Link;
import com.ltw.shorten_link.role.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name")
    private String name = "";

    @Column(name = "money")
    private Long money = 0L;

    @OneToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role = new Role();

    @ManyToMany(mappedBy = "usersAffiliated")
    @JsonBackReference
    private Set<Link> linkAffiliate = new HashSet<Link>();

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @JsonProperty("role")
    public String getRoleName() {
        return role.getName();
    }
}
