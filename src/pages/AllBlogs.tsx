import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Post } from '../utils/types';
import { BlogCard } from '../components/BlogCard';
import { posts } from '../components/datas/posts';


const AllBlogs: React.FC = () => {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const postsPerPage = 6;

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      const startIndex = (page - 1) * postsPerPage;
      const nextBatch = posts.slice(startIndex, startIndex + postsPerPage);
      
      if (nextBatch.length > 0) {
        setDisplayedPosts((prev) => [...prev, ...nextBatch]);
        setPage((prev) => prev + 1);
      }
      
      if (displayedPosts.length + nextBatch.length >= posts.length) {
        setHasMore(false);
      }
      setLoading(false);
    }, 800);
  }, [loading, hasMore, page, displayedPosts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, hasMore]);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-8 sm:py-12">
<header className="max-w-7xl mx-auto mb-10 sm:mb-16 text-center">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tighter">
    Built Stories
  </h1>
  <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto italic px-4">
    Exploring architecture through context, craft, and community.
  </p>
</header>

      <div className="max-w-7xl mx-auto">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <BlogCard post={post} />
              </Link>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Sentinel for Infinite Scroll */}
        <div ref={loaderRef} className="w-full flex justify-center py-10 sm:py-20 min-h-[100px]">
          {loading && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#7db3b8] rounded-full"
                  />
                ))}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 tracking-widest">Loading</span>
            </div>
          )}
          {!hasMore && (
            <p className="text-slate-400 text-xs sm:text-sm font-medium">End of the archive.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;