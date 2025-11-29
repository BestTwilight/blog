
import { BlogPost, PostDetail } from "../types";

// API Configuration - Updated to match backend API v1
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Get a list of posts for the homepage with pagination and search support.
 * Fetches from Java backend API.
 */
export const getAllPosts = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt',
  direction: string = 'desc'
): Promise<{ posts: BlogPost[], totalPages: number, totalElements: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?page=${page}&size=${size}&sort=${sort}&direction=${direction}`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    
    // Transform backend response to match frontend BlogPost interface
    const posts = data.content.map((post: any) => {
      // Format date from createdAt or use date field
      const dateStr = post.date || (post.createdAt ? post.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
      return {
        id: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        readTime: post.readTime,
        date: dateStr,
        tags: post.tags || []
      };
    });
    
    return {
      posts,
      totalPages: data.totalPages,
      totalElements: data.totalElements
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      totalPages: 0,
      totalElements: 0
    };
  }
};

/**
 * Search posts by keyword, category, and tag with pagination.
 * Fetches from Java backend API.
 */
export const searchPosts = async (
  keyword?: string,
  category?: string,
  tag?: string,
  page: number = 0,
  size: number = 10
): Promise<{ posts: BlogPost[], totalPages: number, totalElements: number }> => {
  try {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await fetch(`${API_BASE_URL}/posts/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search posts');
    }
    const data = await response.json();
    
    // Transform backend response to match frontend BlogPost interface
    const posts = data.content.map((post: any) => {
      // Format date from createdAt or use date field
      const dateStr = post.date || (post.createdAt ? post.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
      return {
        id: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        readTime: post.readTime,
        date: dateStr,
        tags: post.tags || []
      };
    });
    
    return {
      posts,
      totalPages: data.totalPages,
      totalElements: data.totalElements
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    return {
      posts: [],
      totalPages: 0,
      totalElements: 0
    };
  }
};

/**
 * Get all unique categories from the backend.
 * Fetches from Java backend API.
 */
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Get all unique tags from the backend.
 * Fetches from Java backend API.
 */
export const getAllTags = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/tags`);
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
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
      tags: post.tags || [],
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

/**
 * Update an existing post on the backend.
 * Requires JWT token in localStorage.
 */
export const updatePost = async (id: number, post: Partial<PostDetail>): Promise<void> => {
  const token = localStorage.getItem('novatech_auth_token');
  if (!token) {
    throw new Error('Not authenticated - please login first');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
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
      throw new Error(errorData.message || 'Failed to update post');
    }
    
    // Clear cache after updating
    sessionStorage.removeItem('novatech_posts');
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

/**
 * Delete a post from the backend.
 * Requires JWT token in localStorage.
 */
export const deletePost = async (id: number): Promise<void> => {
  const token = localStorage.getItem('novatech_auth_token');
  if (!token) {
    throw new Error('Not authenticated - please login first');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete post');
    }
    
    // Clear cache after deleting
    sessionStorage.removeItem('novatech_posts');
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
