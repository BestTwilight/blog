package com.novatech.blog.dto;

import jakarta.validation.constraints.*;
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

    @NotBlank(message = "标题不能为空")
    @Size(min = 5, max = 200, message = "标题长度必须在5-200个字符之间")
    private String title;

    @Size(min = 20, max = 500, message = "摘要长度必须在20-500个字符之间")
    private String excerpt;

    @NotBlank(message = "内容不能为空")
    @Size(min = 50, message = "内容长度至少50个字符")
    private String content;

    @NotBlank(message = "分类不能为空")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "分类只能包含英文字母和空格")
    private String category;

    @Size(max = 10, message = "标签数量不能超过10个")
    private List<@NotBlank(message = "标签不能为空") String> tags;

    @Pattern(regexp = "^\\d+\\s+(min|hour|hours)$", message = "阅读时间格式错误，例如: '5 min' 或 '1 hour'")
    private String readTime;
}