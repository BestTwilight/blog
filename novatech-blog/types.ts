export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: 'Frontend' | 'Backend' | 'AI' | 'DevOps' | 'General';
  readTime: string;
  date: string;
  tags: string[];
}

export interface PostDetail extends BlogPost {
  content: string; // HTML content
}

export interface NavItem {
  label: string;
  path: string;
}
