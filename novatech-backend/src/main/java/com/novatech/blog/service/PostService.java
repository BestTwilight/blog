package com.novatech.blog.service;

import com.novatech.blog.dto.PostRequest;
import com.novatech.blog.dto.PostResponse;
import com.novatech.blog.entity.Post;
import com.novatech.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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

    /**
     * 获取所有文章（带分页）
     */
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * 搜索文章（支持多条件）
     */
    public Page<PostResponse> searchPosts(String keyword, String category, String tag, Pageable pageable) {
        Specification<Post> spec = Specification.where(null);

        // 关键词搜索（标题或内容）
        if (keyword != null && !keyword.trim().isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.or(
                            cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                            cb.like(cb.lower(root.get("content")), "%" + keyword.toLowerCase() + "%"),
                            cb.like(cb.lower(root.get("excerpt")), "%" + keyword.toLowerCase() + "%")
                    )
            );
        }

        // 分类筛选
        if (category != null && !category.trim().isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower(root.get("category")), category.toLowerCase())
            );
        }

        // 标签筛选
        if (tag != null && !tag.trim().isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.isMember(tag, root.get("tags"))
            );
        }

        return postRepository.findAll(spec, pageable)
                .map(this::convertToResponse);
    }

    /**
     * 获取所有分类
     */
    public List<String> getAllCategories() {
        return postRepository.findDistinctCategories();
    }

    /**
     * 获取所有标签
     */
    public List<String> getAllTags() {
        return postRepository.findAllTags();
    }

    public PostResponse getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found with slug: " + slug));
        return convertToResponse(post);
    }

    @Transactional
    public PostResponse createPost(PostRequest request) {
        // 生成slug
        String slug = generateSlug(request.getTitle());

        // 如果slug已存在，添加时间戳
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