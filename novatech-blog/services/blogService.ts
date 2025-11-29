
import { BlogPost, PostDetail } from "../types";

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Get a list of posts for the homepage.
 * Fetches from Java backend API.
 */
export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    // Transform backend response to match frontend BlogPost interface
    return posts.map((post: any) => {
      // Format date from createdAt or use date field
      const dateStr = post.date || (post.createdAt ? post.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
      return {
        id: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        readTime: post.readTime,
        date: dateStr,
        tags: post.tags
      };
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Get full details for a specific post by slug.
 * Fetches from Java backend API.
 */
export const getPostById = async (slug: string): Promise<PostDetail | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
    if (!response.ok) {
      return null;
    }
    const post = await response.json();
    // Format date from createdAt or use date field
    const dateStr = post.date || (post.createdAt ? post.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
    // Transform backend response to match frontend PostDetail interface
    return {
      id: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      readTime: post.readTime,
      date: dateStr,
      tags: post.tags,
      content: post.content
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

/**
 * Save a new post to the backend.
 * Requires JWT token in localStorage.
 */
export const savePost = async (post: Partial<PostDetail>): Promise<void> => {
  const token = localStorage.getItem('novatech_auth_token');
  if (!token) {
    throw new Error('Not authenticated - please login first');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        readTime: post.readTime || '5 min'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to save post');
    }
    
    // Clear cache after saving
    sessionStorage.removeItem('novatech_posts');
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
};
