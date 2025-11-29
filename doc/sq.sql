-- 创建数据库
CREATE DATABASE IF NOT EXISTS blogdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE blogdb;

-- 用户表
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role ENUM('VISITOR', 'ADMIN') NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       INDEX idx_users_username (username)
);

-- 分类表
CREATE TABLE categories (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) UNIQUE NOT NULL,
                            description TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE tags (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(100) UNIQUE NOT NULL,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章表
CREATE TABLE posts (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       slug VARCHAR(255) UNIQUE NOT NULL,
                       title VARCHAR(255) NOT NULL,
                       excerpt VARCHAR(500),
                       content TEXT,
                       category_id BIGINT,
                       read_time VARCHAR(50),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
                       INDEX idx_posts_slug (slug),
                       INDEX idx_posts_created_at (created_at),
                       INDEX idx_posts_category_id (category_id)
);

-- 文章标签关联表
CREATE TABLE post_tags (
                           post_id BIGINT,
                           tag_id BIGINT,
                           PRIMARY KEY (post_id, tag_id),
                           FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                           FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 评论表
CREATE TABLE comments (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          post_id BIGINT NOT NULL,
                          author_name VARCHAR(100) NOT NULL,
                          author_email VARCHAR(255),
                          content TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                          INDEX idx_comments_post_id (post_id),
                          INDEX idx_comments_created_at (created_at)
);

-- 插入默认管理员用户 (密码需要在应用中加密)
INSERT INTO users (username, password, role) VALUES
    ('admin', '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', 'ADMIN');

-- 插入默认分类
INSERT INTO categories (name, description) VALUES
                                               ('Frontend', '前端技术相关文章'),
                                               ('Backend', '后端技术相关文章'),
                                               ('AI', '人工智能相关文章'),
                                               ('DevOps', '运维和部署相关文章'),
                                               ('General', '通用技术文章');

-- 插入示例标签
INSERT INTO tags (name) VALUES
                            ('React'), ('Spring Boot'), ('Java'), ('JavaScript'), ('CSS'),
                            ('Docker'), ('Kubernetes'), ('MySQL'), ('Redis'), ('Linux');

-- 插入示例文章
INSERT INTO posts (slug, title, excerpt, content, category_id, read_time) VALUES
    ('welcome-to-novatech', '欢迎来到 NovaTech', '这是一个技术博客平台，专注于分享前沿技术', '<p>欢迎来到 NovaTech 技术博客！</p>', 5, '2 min');

-- 关联示例文章和标签
INSERT INTO post_tags (post_id, tag_id) VALUES
                                            (1, 1), (1, 3), (1, 5);

-- 创建视图以便于查询
CREATE VIEW post_details AS
SELECT
    p.id,
    p.slug,
    p.title,
    p.excerpt,
    p.content,
    c.name as category_name,
    p.read_time,
    p.created_at,
    p.updated_at,
    GROUP_CONCAT(t.name) as tags
FROM posts p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN post_tags pt ON p.id = pt.post_id
         LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, c.name, p.read_time, p.created_at, p.updated_at;

-- 创建索引以优化查询性能
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_title ON posts(title);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_categories_name ON categories(name);