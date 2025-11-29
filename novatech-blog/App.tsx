
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Background } from './components/Background';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Editor } from './pages/Editor';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './services/authContext';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Background />
        <Navbar />
        
        {/* Route transitions */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/editor" element={<Editor />} />
          </Routes>
        </AnimatePresence>

        <footer className="py-8 border-t border-slate-800/50 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center text-slate-600 text-sm">
            <p>© {new Date().getFullYear()} NovaTech Blog. Built with React & Gemini.</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App;
