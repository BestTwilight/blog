import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { PostCard } from '../components/PostCard';
import { getAllPosts, searchPosts, getAllCategories, getAllTags } from '../services/blogService';
import { BlogPost } from '../types';
import { Loader2, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const loadCategoriesAndTags = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(['All', ...cats]);
        
        const tagList = await getAllTags();
        setTags(tagList);
      } catch (err) {
        console.error('Failed to load categories and tags:', err);
      }
    };
    
    loadCategoriesAndTags();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use search if there's a keyword, otherwise get all posts
        let data;
        if (searchKeyword) {
          data = await searchPosts(
            searchKeyword,
            activeCategory !== 'All' ? activeCategory : undefined,
            undefined,
            currentPage,
            9
          );
        } else {
          data = await getAllPosts(
            currentPage,
            9,
            'createdAt',
            'desc'
          );
        }
        
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        
        if (!data.posts || data.posts.length === 0) {
          setError('No posts found.');
        }
      } catch (err) {
        setError('Failed to load posts. Check backend connection.');
        console.error('Load posts error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, [activeCategory, searchKeyword, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page when searching
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="min-h-screen pb-20 relative z-10">
      <Hero />
      
      <div id="posts-grid" className="max-w-7xl mx-auto px-6 py-10">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search posts..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-400 transition-colors"
            />
          </form>
          
          <div className="flex flex-wrap gap-2 items-center bg-slate-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
            <Filter className="w-4 h-4 text-slate-500 ml-2 mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(0); // Reset to first page when changing category
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  activeCategory === cat 
                    ? 'text-white bg-slate-800 shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {activeCategory === cat && (
                   <motion.div 
                     layoutId="activeTab"
                     className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-white/10 rounded-lg"
                   />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts Count */}
        <div className="mb-6 text-slate-400 text-sm font-mono">
          {totalElements > 0 ? `Showing ${currentPage * 9 + 1}-${Math.min((currentPage + 1) * 9, totalElements)} of ${totalElements} posts` : 'No posts found'}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin relative z-10" />
            </div>
            <p className="text-cyan-400/60 mt-6 font-mono text-sm tracking-widest uppercase animate-pulse">Establishing Uplink...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-red-400 font-mono text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-slate-400 font-mono text-sm">No posts available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2 bg-slate-900/50 p-2 rounded-xl border border-white/5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Calculate page numbers to display (centered around current page)
                      let startPage = Math.max(0, currentPage - 2);
                      let endPage = Math.min(totalPages - 1, startPage + 4);
                      
                      if (endPage - startPage < 4) {
                        startPage = Math.max(0, endPage - 4);
                      }
                      
                      const page = startPage + i;
                      
                      if (page >= totalPages) return null;
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-cyan-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {page + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};
