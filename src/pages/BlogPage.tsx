import { useState, useEffect } from 'react';
import { BlogCard } from '../components/BlogCard';
import { Link } from 'react-router-dom';
import { posts as fallbackPosts } from '../components/datas/posts';
import { api, resolveImageUrl, type BlogPostItem } from '../services/api';
import { Loader2, ArrowRight } from 'lucide-react';

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>(() => 
    fallbackPosts.map(p => ({
      ...p,
      slug: String(p.id),
      image: resolveImageUrl(p.image, '/pexels-chudin-alexey-26964541.jpg')
    }))
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadJournalPosts() {
      try {
        setLoading(true);
        const livePosts = await api.getBlogPosts();
        if (isMounted && livePosts && livePosts.length > 0) {
          const mapped = livePosts.map(lp => ({
            ...lp,
            image: resolveImageUrl(lp.image, '/pexels-chudin-alexey-26964541.jpg')
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.warn('Using local posts fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadJournalPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredPost = posts[0] || fallbackPosts[0];
  const sidePosts = posts.slice(1, 6);

  return (
    <section className="w-full relative py-16 sm:py-24 bg-[#f5f7f7] text-slate-900 font-sans border-t border-slate-200">
      <div className="w-full px-4 sm:px-8 md:px-12">
        
        {/* Header (Full Width & Light Aesthetic) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 sm:w-12 h-[3px] bg-[#205b63]"></span>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] font-bold text-[#205b63]">
                Editorial & Insights
              </span>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-[#205b63] ml-2" />}
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900">
              FEATURED STORIES
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-md">
            Architectural perspectives, fabrication engineering insights, and spatial case studies.
          </p>
        </div>

        {/* Hero Section: Full Width Large Card + Side List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Main Featured Post */}
          <div className="lg:col-span-2">
            <Link to={`/blog/${featuredPost.id}`} className="block h-full">
              <BlogCard
                post={{
                  ...featuredPost,
                  image: resolveImageUrl(featuredPost.image, '/pexels-chudin-alexey-26964541.jpg')
                }}
                featured={true}
              />
            </Link>
          </div>
          
          {/* Side List (Other featured posts) in Light Card */}
          <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 font-mono">
              Other Featured Posts
            </h3>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[480px]">
              {sidePosts.map(post => (
                <Link to={`/blog/${post.id}`} key={post.id} className="group">
                  <div className="flex gap-3 sm:gap-4 p-2 rounded-xl transition-all duration-300 hover:bg-slate-50 border border-transparent hover:border-slate-200">
                    <img 
                      src={resolveImageUrl(post.image, '/1.jpg')} 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0 shadow-sm" 
                      alt={post.title} 
                    />
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] text-[#205b63] font-mono font-semibold uppercase tracking-wider mb-1">
                        {post.category} • {post.readTime}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold leading-snug text-slate-800 group-hover:text-[#205b63] transition-colors line-clamp-2">
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
          <Link to="/allblogs" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#205b63] hover:bg-[#18454b] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md group">
            <span>Explore All Stories</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BlogPage;