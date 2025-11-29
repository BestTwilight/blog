package com.novatech.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String excerpt;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private List<String> tags;
    
    private String readTime;
}
