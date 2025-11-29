
import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { PostCard } from '../components/PostCard';
import { getAllPosts } from '../services/blogService';
import { BlogPost } from '../types';
import { Loader2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Don't use cache - always fetch fresh data from backend
        const data = await getAllPosts();
        if (!data || data.length === 0) {
          setError('No posts found. Make sure backend is running.');
        }
        setPosts(data);
        sessionStorage.setItem('novatech_posts', JSON.stringify(data));
      } catch (err) {
        setError('Failed to load posts. Check backend connection.');
        console.error('Load posts error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const categories = ['All', 'Frontend', 'Backend', 'AI', 'DevOps'];
  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen pb-20 relative z-10">
      <Hero />
      
      <div id="posts-grid" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-4 md:space-y-0 backdrop-blur-sm py-4 rounded-xl sticky top-20 z-40 transition-all">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <span className="w-1 h-8 bg-cyan-400 mr-4 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
            Latest Insights
          </h2>
          
          <div className="flex flex-wrap gap-2 items-center bg-slate-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
            <Filter className="w-4 h-4 text-slate-500 ml-2 mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
