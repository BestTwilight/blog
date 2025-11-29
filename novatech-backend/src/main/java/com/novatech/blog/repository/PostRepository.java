package com.novatech.blog.repository;

import com.novatech.blog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    Optional<Post> findBySlug(String slug);
    boolean existsBySlug(String slug);
    
    /**
     * 获取所有不重复的分类
     */
    @Query("SELECT DISTINCT c.name FROM Post p JOIN p.category c ORDER BY c.name")
    List<String> findDistinctCategories();
    
    /**
     * 获取所有标签（去重）
     */
    @Query("SELECT DISTINCT t.name FROM Post p JOIN p.tags t ORDER BY t.name")
    List<String> findAllTags();
}