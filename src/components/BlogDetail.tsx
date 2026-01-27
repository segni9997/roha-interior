import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { posts } from '../pages/BlogPage';

const BlogDetail = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  if (!post) return <div className="h-screen flex items-center justify-center">Post not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-white pb-20"
    >
      {/* Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-4">
        <Link to="/blog" className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to articles</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 mb-12">
        <div className="flex gap-2 mb-6">
          <span className="px-3 py-1 bg-slate-100 text-[#7db3b8] text-[10px] font-black uppercase rounded-full">
            {post.category}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">
            {post.type}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-8">
          {post.title}
        </h1>
        
        {/* Featured Image */}
        <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Content Layout */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar Info - Glass Style */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-10 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 backdrop-blur-sm">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                   <img src={`https://ui-avatars.com/api/?name=${post.author}`} alt={post.author} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Written by</p>
                  <p className="text-sm font-bold text-slate-900">{post.author}</p>
                </div>
              </div>
              <hr className="border-slate-200" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Date</p>
                  <p className="text-sm font-medium flex items-center gap-2"><Calendar size={14}/> {post.year}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Reading Time</p>
                  <p className="text-sm font-medium flex items-center gap-2"><Clock size={14}/> {post.readTime}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Article Body */}
        <main className="lg:col-span-8 order-1 lg:order-2">
          <div className="prose prose-slate lg:prose-xl max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed mb-8 italic">
              {post.description}
            </p>
            <p className="text-slate-800 leading-loose mb-6">
              In the rapidly evolving landscape of SaaS, the intersection of user interface (UI) and user experience (UX) has never been more critical. As businesses pivot toward digital-first models, the tools they use must not only be functional but also intuitive and delightful.
            </p>
            <h2 className="text-2xl font-bold mb-4 mt-8">The Core Principles</h2>
            <p className="text-slate-800 leading-loose mb-6">
              Effective design starts with empathy. Understanding the user's pain points allows us to create solutions that feel natural. This involves a rigorous process of prototyping, testing, and iterating based on real-world feedback.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-800 mb-6">
              <li>Consistency across all modules</li>
              <li>Minimalist aesthetic to reduce cognitive load</li>
              <li>Accessibility as a primary feature, not an afterthought</li>
            </ul>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default BlogDetail;