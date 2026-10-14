import { useState, useEffect } from 'react';
import { BlogCard } from '../components/BlogCard';
import { Link } from 'react-router-dom';
import { api, resolveImageUrl, type BlogPostItem } from '../services/api';
import { Loader2, ArrowRight, BookOpen, Building2 } from 'lucide-react';

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadJournalPosts() {
      try {
        setLoading(true);
        const livePosts = await api.getBlogPosts().catch(() => []);
        if (isMounted) {
          if (livePosts && livePosts.length > 0) {
            const mapped = livePosts.map(lp => ({
              ...lp,
              image: resolveImageUrl(lp.image, '/tr/279A1756.JPG')
            }));
            setPosts(mapped);
          } else {
            // No fallback blogs as requested
            setPosts([]);
          }
        }
      } catch (err) {
        console.warn('Failed to load journal posts:', err);
        if (isMounted) setPosts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadJournalPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredPost = posts[0] || null;
  const sidePosts = posts.slice(1, 6);

  return (
    <section className="w-full relative py-16 sm:py-24 bg-[#111f20] text-white font-sans border-t border-white/10">
      <div className="w-full px-4 sm:px-8 md:px-12">
        
        {/* Header (Full Width & Main Dark Theme) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 sm:w-12 h-[3px] bg-cyan-400"></span>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] font-bold text-cyan-300">
                Editorial & Insights
              </span>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-cyan-400 ml-2" />}
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase">
              FEATURED STORIES
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-md border-r-4 border-cyan-400 pr-4 sm:pr-5">
            Architectural perspectives, fabrication engineering insights, and spatial case studies.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-300">
              Loading featured stories...
            </p>
          </div>
        )}

        {/* DEDICATED EMPTY STATE: NO BLOGS AVAILABLE */}
        {!loading && posts.length === 0 && (
          <div className="py-16 px-6 text-center max-w-xl mx-auto rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-[#172a2b] border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-300 shadow-md">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
              No Blogs Available in Architectural Archive
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6">
              Our editorial monographs and spatial essays are currently in curation. Stay tuned for upcoming publications.
            </p>
            <Link
              to="/interior"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <Building2 size={13} />
              <span>Explore Architectural Works</span>
            </Link>
          </div>
        )}

        {/* Hero Section: Full Width Large Card + Side List (IF POSTS EXIST) */}
        {!loading && featuredPost && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
              {/* Main Featured Post */}
              <div className="lg:col-span-2">
                <Link to={`/blog/${featuredPost.id}`} className="block h-full">
                  <BlogCard
                    post={{
                      ...featuredPost,
                      image: resolveImageUrl(featuredPost.image, '/tr/279A1756.JPG')
                    }}
                    featured={true}
                  />
                </Link>
              </div>
              
              {/* Side List (Other featured posts) in Glass Dark Card */}
              <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 border-b border-white/10 pb-3 font-mono">
                  Other Featured Posts
                </h3>
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[480px]">
                  {sidePosts.map(post => (
                    <Link to={`/blog/${post.id}`} key={post.id} className="group">
                      <div className="flex gap-3 sm:gap-4 p-2 rounded-xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10">
                        <img 
                          src={resolveImageUrl(post.image, '/tr/279A1756.JPG')} 
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0 shadow-sm border border-white/10" 
                          alt={post.title} 
                        />
                        <div className="flex flex-col justify-center">
                          <span className="text-[10px] text-cyan-300 font-mono font-semibold uppercase tracking-wider mb-1">
                            {post.category} • {post.readTime || '5 min'}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold leading-snug text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Link to All Blogs */}
            <div className="flex justify-end items-center pt-4">
              <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#205b63] hover:bg-[#286f78] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md group">
                <span>Explore All Stories</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default BlogPage;