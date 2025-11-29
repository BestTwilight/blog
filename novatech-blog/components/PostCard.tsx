import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight, Cpu } from 'lucide-react';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: BlogPost;
  index: number;
}

export const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  const categoryConfig = {
    Frontend: { color: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-400/10' },
    Backend: { color: 'text-green-400', border: 'border-green-400/20', bg: 'bg-green-400/10' },
    AI: { color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/10' },
    DevOps: { color: 'text-orange-400', border: 'border-orange-400/20', bg: 'bg-orange-400/10' },
    General: { color: 'text-#C5A059-400', border: 'border-slate-400/20', bg: 'bg-slate-400/10' },
  }[post.category] || { color: 'text-slate-400', border: 'border-slate-400/20', bg: 'bg-slate-400/10' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative h-full"
    >
      <Link to={`/post/${post.id}`} className="block h-full">
        {/* Animated Gradient Border Layer */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-slate-800/50 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        
        {/* Main Card Content (Glassmorphism) */}
        <div className="relative h-full flex flex-col p-6 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-colors overflow-hidden">
          
          {/* Inner Glow Spotlight Effect on Hover */}
          <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none skew-x-12"></div>

          <div className="flex items-center justify-between mb-4 z-10">
            <span className={`px-3 py-1 text-xs font-mono font-medium rounded-full border ${categoryConfig.bg} ${categoryConfig.border} ${categoryConfig.color} flex items-center gap-2`}>
              {post.category === 'AI' && <Cpu className="w-3 h-3" />}
              {post.category}
            </span>
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-cyan-500/20 transition-colors">
                 <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300 z-10">
            {post.title}
          </h3>
          
          <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed z-10 group-hover:text-slate-300 transition-colors">
            {post.excerpt}
          </p>

          <div className="flex items-center space-x-4 text-xs text-slate-500 font-mono mt-auto pt-4 border-t border-white/5 z-10">
            <div className="flex items-center space-x-1 group-hover:text-cyan-400/80 transition-colors">
              <Calendar className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-1 group-hover:text-purple-400/80 transition-colors">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};