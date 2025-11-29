
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Eye, Edit3, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { savePost } from '../services/blogService';
import { BlogPost } from '../types';

export const Editor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('General');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [readTime, setReadTime] = useState('5 min');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const newPost = {
        title,
        excerpt: excerpt || content.substring(0, 100) + '...',
        content,
        category,
        tags: tags ? tags.split(',').map(t => t.trim()) : ['Blog'],
        readTime: readTime || '5 min',
        date: new Date().toISOString().split('T')[0]
      };

      await savePost(newPost);
      
      // Show success message
      setSuccessMessage('✅ Article published successfully! Redirecting to home...');
      
      // Clear form
      setTitle('');
      setExcerpt('');
      setContent('');
      setTags('');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-sm font-mono">Draft Mode</span>
          <button 
            onClick={handleSave}
            disabled={isSaving || !title || !content}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Input Area */}
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
          <input 
            type="text" 
            placeholder="Post Title..." 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-transparent text-4xl font-bold text-white placeholder:text-slate-700 border-none outline-none"
          />
          
          <textarea
            placeholder="Brief excerpt (optional)"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-slate-300 text-sm resize-none h-20 outline-none focus:border-cyan-400"
          />
          
          <div className="flex gap-4">
            <select 
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="bg-slate-900 text-slate-300 border border-slate-700 rounded-md px-3 py-1 text-sm outline-none focus:border-cyan-500"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="AI">AI</option>
              <option value="DevOps">DevOps</option>
              <option value="General">General</option>
            </select>
            
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="flex-1 bg-slate-900 text-slate-300 border border-slate-700 rounded-md px-3 py-1 text-sm outline-none focus:border-cyan-500"
            />
            
            <input
              type="text"
              placeholder="Read time (e.g., 5 min)"
              value={readTime}
              onChange={e => setReadTime(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 rounded-md px-3 py-1 text-sm outline-none focus:border-cyan-500 w-32"
            />
          </div>

          <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/30">
             <textarea
               className="w-full h-full bg-transparent p-6 text-slate-300 resize-none outline-none font-mono leading-relaxed"
               placeholder="Write your masterpiece in HTML or Markdown..."
               value={content}
               onChange={e => setContent(e.target.value)}
             />
          </div>
        </div>

        {/* Preview Area */}
        <div className="hidden lg:flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-wider">
            <Eye className="w-3 h-3" /> Live Preview
          </div>
          <div className="flex-1 p-8 overflow-y-auto prose prose-invert max-w-none">
            {/* Simple Mock Preview: In production use <ReactMarkdown> */}
            <h1 className="text-3xl font-bold text-white mb-4">{title || "Untitled Post"}</h1>
            <div className="whitespace-pre-wrap text-slate-300">
                {content || <span className="text-slate-600 italic">Preview will appear here...</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
