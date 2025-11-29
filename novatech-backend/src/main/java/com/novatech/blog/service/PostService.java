package com.novatech.blog.service;

import com.novatech.blog.dto.PostRequest;
import com.novatech.blog.dto.PostResponse;
import com.novatech.blog.entity.Post;
import com.novatech.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public PostResponse getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found with slug: " + slug));
        return convertToResponse(post);
    }
    
    @Transactional
    public PostResponse createPost(PostRequest request) {
        // Generate slug from title
        String slug = generateSlug(request.getTitle());
        
        // Check if slug already exists
        if (postRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }
        
        Post post = Post.builder()
                .slug(slug)
                .title(request.getTitle())
                .excerpt(request.getExcerpt())
                .content(request.getContent())
                .category(request.getCategory())
                .tags(request.getTags())
                .readTime(request.getReadTime() != null ? request.getReadTime() : "5 min")
                .build();
        
        Post savedPost = postRepository.save(post);
        return convertToResponse(savedPost);
    }
    
    @Transactional
    public PostResponse updatePost(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        
        post.setTitle(request.getTitle());
        post.setExcerpt(request.getExcerpt());
        post.setContent(request.getContent());
        post.setCategory(request.getCategory());
        post.setTags(request.getTags());
        if (request.getReadTime() != null) {
            post.setReadTime(request.getReadTime());
        }
        
        Post updatedPost = postRepository.save(post);
        return convertToResponse(updatedPost);
    }
    
    @Transactional
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post not found with id: " + id);
        }
        postRepository.deleteById(id);
    }
    
    private PostResponse convertToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .slug(post.getSlug())
                .title(post.getTitle())
                .excerpt(post.getExcerpt())
                .content(post.getContent())
                .category(post.getCategory())
                .tags(post.getTags())
                .readTime(post.getReadTime())
                .createdAt(post.getCreatedAt())
                .date(post.getCreatedAt().format(DATE_FORMATTER))
                .build();
    }
    
    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
}
