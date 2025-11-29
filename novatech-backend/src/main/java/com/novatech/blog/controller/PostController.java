package com.novatech.blog.controller;

import com.novatech.blog.dto.PostRequest;
import com.novatech.blog.dto.PostResponse;
import com.novatech.blog.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Tag(name = "文章管理", description = "博客文章的增删改查接口")
public class PostController {

    private final PostService postService;

    @Operation(
            summary = "获取文章列表（分页）",
            description = "获取所有文章，支持分页和排序",
            responses = {
                    @ApiResponse(responseCode = "200", description = "成功获取文章列表"),
                    @ApiResponse(responseCode = "400", description = "参数错误", content = @Content)
            }
    )
    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @Parameter(description = "页码（从0开始）", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "每页数量", example = "10")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "排序字段", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sort,

            @Parameter(description = "排序方向", example = "desc")
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @Operation(
            summary = "搜索文章",
            description = "根据关键词、分类、标签搜索文章",
            responses = {
                    @ApiResponse(responseCode = "200", description = "搜索成功"),
                    @ApiResponse(responseCode = "400", description = "参数错误", content = @Content)
            }
    )
    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @Parameter(description = "搜索关键词（搜索标题、内容、摘要）", example = "Spring Boot")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "分类筛选", example = "Backend")
            @RequestParam(required = false) String category,

            @Parameter(description = "标签筛选", example = "Java")
            @RequestParam(required = false) String tag,

            @Parameter(description = "页码", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "每页数量", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.searchPosts(keyword, category, tag, pageable));
    }

    @Operation(
            summary = "获取所有分类",
            description = "返回系统中所有不重复的文章分类",
            responses = {
                    @ApiResponse(responseCode = "200", description = "成功")
            }
    )
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(postService.getAllCategories());
    }

    @Operation(
            summary = "获取所有标签",
            description = "返回系统中所有不重复的文章标签",
            responses = {
                    @ApiResponse(responseCode = "200", description = "成功")
            }
    )
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        return ResponseEntity.ok(postService.getAllTags());
    }

    @Operation(
            summary = "根据 slug 获取文章详情",
            description = "通过文章的唯一 slug 标识获取完整文章内容",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "成功",
                            content = @Content(schema = @Schema(implementation = PostResponse.class))
                    ),
                    @ApiResponse(responseCode = "404", description = "文章不存在", content = @Content)
            }
    )
    @GetMapping("/{slug}")
    public ResponseEntity<PostResponse> getPostBySlug(
            @Parameter(description = "文章 slug", example = "welcome-to-novatech")
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(postService.getPostBySlug(slug));
    }

    @Operation(
            summary = "创建新文章",
            description = "创建一篇新的博客文章（需要管理员权限）",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "创建成功",
                            content = @Content(schema = @Schema(implementation = PostResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "参数验证失败", content = @Content),
                    @ApiResponse(responseCode = "401", description = "未授权", content = @Content),
                    @ApiResponse(responseCode = "403", description = "权限不足", content = @Content)
            }
    )
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponse> createPost(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "文章内容",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PostRequest.class))
            )
            @Valid @RequestBody PostRequest request
    ) {
        PostResponse response = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "更新文章",
            description = "根据 ID 更新指定文章（需要管理员权限）",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "更新成功"),
                    @ApiResponse(responseCode = "400", description = "参数验证失败", content = @Content),
                    @ApiResponse(responseCode = "401", description = "未授权", content = @Content),
                    @ApiResponse(responseCode = "403", description = "权限不足", content = @Content),
                    @ApiResponse(responseCode = "404", description = "文章不存在", content = @Content)
            }
    )
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponse> updatePost(
            @Parameter(description = "文章 ID", example = "1")
            @PathVariable Long id,

            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "更新的文章内容",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PostRequest.class))
            )
            @Valid @RequestBody PostRequest request
    ) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    @Operation(
            summary = "删除文章",
            description = "根据 ID 删除指定文章（需要管理员权限）",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "删除成功"),
                    @ApiResponse(responseCode = "401", description = "未授权", content = @Content),
                    @ApiResponse(responseCode = "403", description = "权限不足", content = @Content),
                    @ApiResponse(responseCode = "404", description = "文章不存在", content = @Content)
            }
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePost(
            @Parameter(description = "文章 ID", example = "1")
            @PathVariable Long id
    ) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}