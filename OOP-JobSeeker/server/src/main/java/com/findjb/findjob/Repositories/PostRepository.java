package com.findjb.findjob.Repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.findjb.findjob.Model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByEnterpriseId(Long id, Pageable paginate);

    Page<Post> findAll(Pageable paginate);

    Page<Post> findByNameContaining(String pattern, Pageable paginate);
    List<Post> findByIdNot(Long id);
}
