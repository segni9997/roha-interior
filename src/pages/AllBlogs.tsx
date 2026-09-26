import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Post } from '../utils/types';
import { BlogCard } from '../components/BlogCard';
import { posts as fallbackPosts } from '../components/datas/posts';
import { NavigationOverlay } from '../components/NavBar';
import Footer from '../components/Footer';
import { api, resolveImageUrl } from '../services/api';
import { BookOpen, Filter, Search, Loader2 } from 'lucide-react';

const CATEGORIES = ['All', 'Editorial', 'Interior', 'Model Making', 'Architecture', 'Sustainability'];

const AllBlogs: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>(fallbackPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAllJournalPosts() {
      try {
        setLoading(true);
        const livePosts = await api.getBlogPosts();
        if (isMounted && livePosts && livePosts.length > 0) {
          const mapped: Post[] = livePosts.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            type: p.type,
            year: p.year,
            author: p.author,
            readTime: p.readTime,
            image: resolveImageUrl(p.image, '/pexels-chudin-alexey-26964541.jpg'),
            content: (p.content || []) as any,
          }));
          setAllPosts(mapped);
        }
      } catch (err) {
        console.warn('Backend unavailable, using fallback posts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAllJournalPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (post.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        searchQuery === '' ||
        (post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = displayedPosts.length < filteredPosts.length;

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => Math.min(prev + 3, filteredPosts.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, filteredPosts.length]);

  return (
    <div className="min-h-screen bg-[#f5f7f7] text-slate-900 font-sans flex flex-col justify-between">
      <div>
        <NavigationOverlay />

        {/* ----------------- HERO HEADER ----------------- */}
        <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 bg-[#f5f7f7] border-b border-slate-200 px-4 sm:px-8 md:px-12 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#205b63]/10 text-[#205b63] border border-[#205b63]/20 text-xs font-mono font-bold tracking-widest uppercase shadow-sm">
              {/* <BookOpen size={14} /> */}
              <span>Studio Journal & Insights</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
              BUILT <span className="text-[#205b63]">STORIES.</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
              Perspectives on contemporary architecture, physical scale model engineering, interior spatial harmony, and sustainable design.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto relative pt-4">
              <Search className="absolute left-4 top-1/2 translate-y-0.5 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(6);
                }}
                placeholder="Search architectural stories..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#205b63]/40 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* ----------------- CATEGORY FILTER PILLS ----------------- */}
        <div className="w-full px-4 sm:px-8 md:px-12 py-8 max-w-8xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 mr-2 hidden sm:flex font-semibold">
              <Filter size={14} className="text-[#205b63]" />
              <span>Topic:</span>
            </div>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#205b63] text-white shadow-md border border-[#205b63]'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* ----------------- ARTICLES GRID ----------------- */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {displayedPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="block">
                  <BlogCard post={post} />
                </Link>
              ))}
            </AnimatePresence>
          </motion.div>

          {displayedPosts.length === 0 && !loading && (
            <div className="text-center py-24 text-slate-500">
              <p className="text-lg font-medium">No stories found matching your criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs font-mono font-bold text-[#205b63] underline cursor-pointer uppercase"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Infinite Scroll Loader */}
          <div ref={loaderRef} className="w-full flex justify-center py-12 min-h-[80px]">
            {loading && (
              <div className="flex items-center gap-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
                <Loader2 className="w-4 h-4 animate-spin text-[#205b63]" />
                <span>Loading Stories...</span>
              </div>
            )}
            {!hasMore && displayedPosts.length > 0 && (
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                End of Stories Archive
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllBlogs;