
import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { BlogPost, PostDetail as IPostDetail } from '../types';
import { getPostById } from '../services/blogService';
import { ArrowLeft, Calendar, Clock, Share2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [post, setPost] = useState<IPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      
      try {
        // Fetch post from backend using slug
        const data = await getPostById(id);
        setPost(data);
        if (!data) {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id]);

  if (loading) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <p className="text-slate-500 font-mono text-sm">Deciphering Data Stream...</p>
        </div>
     );
  }

  if (!post) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">404 // {error ? 'Error Loading Post' : 'Data Not Found'}</h2>
            <Link to="/" className="text-cyan-400 hover:underline">Return to Mainframe</Link>
        </div>
    );
  }

  return (
    <article className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-slate-400 hover:text-cyan-400 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
              {post.category}
            </span>
            {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-sm border border-slate-700">
                    #{tag}
                </span>
            ))}
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>

          <div className="flex items-center justify-between text-slate-500 text-sm font-mono py-6 border-y border-slate-800">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <button className="flex items-center space-x-2 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </header>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="prose prose-invert prose-lg max-w-none 
              prose-headings:text-slate-100 prose-headings:font-bold
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-code:text-purple-300 prose-code:bg-slate-900 prose-code:px-1 prose-code:rounded
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
              prose-li:text-slate-300
              prose-blockquote:border-l-cyan-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-4"
            dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </article>
  );
};
