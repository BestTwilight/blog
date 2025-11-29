package com.novatech.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String slug;
    private String title;
    private String excerpt;
    private String content;
    private String category;
    private List<String> tags;
    private String readTime;
    private LocalDateTime createdAt;
    private String date;  // Formatted date for frontend compatibility
}
