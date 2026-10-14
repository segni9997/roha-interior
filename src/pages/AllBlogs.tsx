import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Post } from '../utils/types';
import { BlogCard } from '../components/BlogCard';
import { NavigationOverlay } from '../components/NavBar';
import Footer from '../components/Footer';
import { api, resolveImageUrl } from '../services/api';
import { Filter, Search, Loader2, BookOpen, Compass, Building2 } from 'lucide-react';
import { FloatingShape, SHAPES } from '../components/FloatingShapes';

const CATEGORIES = ['All', 'Editorial', 'Interior', 'Model Making', 'Architecture', 'Sustainability'];

const AllBlogs: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAllJournalPosts() {
      try {
        setLoading(true);
        const livePosts = await api.getBlogPosts().catch(() => []);
        if (isMounted) {
          if (livePosts && livePosts.length > 0) {
            const mapped: Post[] = livePosts.map((p) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              category: p.category,
              type: p.type,
              year: p.year,
              author: p.author,
              readTime: p.readTime,
              image: resolveImageUrl(p.image, '/tr/279A1756.JPG'),
              content: (p.content || []) as any,
            }));
            setAllPosts(mapped);
          } else {
            // No fallback blogs as explicitly requested
            setAllPosts([]);
          }
        }
      } catch (err) {
        console.warn('Failed to load journal posts:', err);
        if (isMounted) setAllPosts([]);
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
    <div className="min-h-screen bg-[#111f20] text-white font-sans flex flex-col justify-between selection:bg-[#205b63] selection:text-white">
      <div>
        <NavigationOverlay />

        {/* ----------------- HERO HEADER (MATCHED TO MAIN THEME) ----------------- */}
        <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 bg-gradient-to-b from-[#0c1617] via-[#111f20] to-[#142628] border-b border-white/10 px-4 sm:px-8 md:px-12 text-center overflow-hidden">
          {/* Subtle Ambient Shapes */}
          <FloatingShape
            src={SHAPES.diamond}
            size={70}
            top="15%"
            left="4%"
            blur="1px"
            opacity={0.2}
            rotate={15}
            duration={8}
          />
          <FloatingShape
            src={SHAPES.cylinder}
            size={80}
            top="20%"
            right="5%"
            blur="2px"
            opacity={0.18}
            rotate={-20}
            duration={9}
            delay={1}
          />

          <div className="max-w-4xl mx-auto space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#205b63]/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold tracking-widest uppercase shadow-sm">
              <BookOpen size={13} className="text-cyan-300" />
              <span>Architectural Journal & Monograph</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] uppercase">
              BUILT <span className="text-cyan-400">STORIES.</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed border-r-4 border-[#205b63] pr-4 sm:pr-5 inline-block text-left">
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
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/5 border border-white/15 text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-[#205b63]/50 shadow-inner backdrop-blur-md transition-all"
              />
            </div>
          </div>
        </section>

        {/* ----------------- MAIN CONTENT AREA ----------------- */}
        <div className="w-full px-4 sm:px-8 md:px-12 py-10 max-w-7xl mx-auto">
          {/* Loading Indicator */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
              <p className="text-xs font-mono uppercase tracking-widest text-slate-300">
                Syncing architectural archive...
              </p>
            </div>
          )}

          {/* DEDICATED EMPTY STATE: NO BLOGS AVAILABLE IN ARCHITECTURAL ARCHIVE */}
          {!loading && allPosts.length === 0 && (
            <div className="py-20 sm:py-28 px-6 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-[#172a2b] border border-cyan-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(32,91,99,0.3)]">
                <BookOpen className="w-10 h-10 text-cyan-300" />
              </div>
              
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-3 block">
                • Archive Notice
              </span>
              
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4 uppercase">
                No Blogs Available in Architectural Archive
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-8">
                Our editorial monographs, spatial essays, and technical publications are currently being curated for the architectural collection. Please explore our live physical scale models and interior portfolios while new articles are prepared.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/interior"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-black/30"
                >
                  <Building2 size={14} />
                  <span>Architectural Projects</span>
                </Link>
                <Link
                  to="/model-making"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono font-bold uppercase tracking-wider transition-all backdrop-blur-md"
                >
                  <Compass size={14} />
                  <span>Physical Scale Models</span>
                </Link>
              </div>
            </div>
          )}

          {/* ARTICLES DISPLAYED (IF POSTS EXIST IN BACKEND) */}
          {!loading && allPosts.length > 0 && (
            <>
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 mr-2 hidden sm:flex font-semibold">
                  <Filter size={14} className="text-cyan-400" />
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
                          ? 'bg-[#205b63] text-white shadow-lg border border-cyan-400/40 shadow-cyan-950/50 scale-105'
                          : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Articles Grid */}
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {displayedPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="block">
                      <BlogCard post={post} />
                    </Link>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Filtered Empty State */}
              {displayedPosts.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                  <p className="text-base font-medium text-slate-300">No stories found matching your filter criteria.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="mt-3 text-xs font-mono font-bold text-cyan-400 underline cursor-pointer uppercase tracking-wider"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Infinite Scroll Loader */}
              <div ref={loaderRef} className="w-full flex justify-center py-12 min-h-[80px]">
                {!hasMore && displayedPosts.length > 0 && (
                  <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
                    End of Stories Archive
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllBlogs;