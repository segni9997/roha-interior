import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';
import { posts as fallbackPosts } from './datas/posts';
import { api, resolveImageUrl, type BlogPostItem } from '../services/api';
import { ResponsiveContentGallery } from './ResponsiveContentGallery';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPost() {
      if (!id) return;
      try {
        setLoading(true);
        const live = await api.getBlogPost(parseInt(id));
        if (isMounted && live) {
          setPost(live);
        }
      } catch (err) {
        console.warn('Backend detail unavailable, using fallback post:', err);
        const fb = fallbackPosts.find((p) => p.id === parseInt(id));
        if (isMounted && fb) {
          setPost({
            ...fb,
            slug: String(fb.id),
            image: fb.image,
            content: fb.content as any
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPost();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-[#f5f7f7]">
        <Loader2 className="w-8 h-8 animate-spin text-[#205b63]" />
        <span className="text-sm font-bold tracking-widest text-slate-500 uppercase">Loading Article</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Post not found</h2>
        <Link to="/blog" className="text-[#205b63] underline font-medium">Return to Articles</Link>
      </div>
    );
  }

  const coverImage = resolveImageUrl(post.cover_image || post.image, '/pexels-chudin-alexey-26964541.jpg');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="relative min-h-screen object-contain pb-20 bg-[#fafafa]"
    >
      {/* Absolute Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/roha.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#205b63]/80 via-white/20 to-cyan-800/40"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center gap-4">
        <Link to="/blog" className="flex items-center gap-2 text-slate-700 hover:text-black transition-colors font-medium">
          <ArrowLeft size={18} />
          <span className="text-sm">Back to articles</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 mb-12">
        <div className="flex gap-2 mb-6">
          <span className="px-3 py-1 bg-white/90 text-[#205b63] text-[10px] font-black uppercase rounded-full shadow-sm">
            {post.category}
          </span>
          <span className="px-3 py-1 bg-white/90 text-slate-600 text-[10px] font-black uppercase rounded-full shadow-sm">
            {post.type}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-8">
          {post.title}
        </h1>
        
        {/* Featured Image */}
        <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-200">
          <img 
            src={coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Content Layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar Info - Glass Style */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-10 p-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || "Editorial")}&background=205b63&color=fff`} alt={post.author} />
                </div>
                <div>
                  <p className="text-[10px] text-[#205b63] uppercase font-bold">Written by</p>
                  <p className="text-sm font-bold text-slate-900">{post.author || "ROHA Editorial"}</p>
                </div>
              </div>
              <hr className="border-slate-200" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#205b63] uppercase font-bold mb-1">Date</p>
                  <p className="text-sm font-medium flex items-center gap-2"><Calendar size={14}/> {post.year || "2024"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#205b63] uppercase font-bold mb-1">Reading Time</p>
                  <p className="text-sm font-medium flex items-center gap-2"><Clock size={14}/> {post.readTime || "5 min read"}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Article Body */}
        <main className="lg:col-span-8 order-1 lg:order-2 bg-white/85 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="prose prose-slate lg:prose-xl max-w-none">
            <p className="text-xl text-slate-700 leading-relaxed mb-8 italic border-l-4 border-[#205b63] pl-4">
              {post.description}
            </p>

            {post.content && post.content.length > 0 ? (
              post.content.map((block, idx) => {
                if (block.type === 'heading') {
                  return <h2 key={idx} className="text-2xl font-bold mb-4 mt-8 text-slate-900">{block.text}</h2>;
                }
                if (block.type === 'paragraph') {
                  return <p key={idx} className="text-slate-800 leading-loose mb-6">{block.text}</p>;
                }
                if (block.type === 'list' && block.items) {
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-3 text-slate-800 mb-6">
                      {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 mt-8 text-slate-900">The Architectural Essence</h2>
                <p className="text-slate-800 leading-loose mb-6">
                  In the rapidly evolving landscape of architectural curation, the synthesis between light, raw materiality, and spatial flow defines contemporary luxury.
                </p>
                <p className="text-slate-800 leading-loose mb-6">
                  Our practice honors the tactile nature of construction. Whether designing monolithic residential volumes or executing 0.1mm micro-tolerance presentation models, precision remains paramount.
                </p>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Supplemental Responsive Gallery Images */}
      {post.gallery_images && post.gallery_images.length > 0 && (
        <section className="relative z-10 max-w-5xl mx-auto px-6 mt-16 pt-12 border-t border-slate-200">
          <ResponsiveContentGallery
            images={post.gallery_images}
            title={`${post.type || 'Monograph'} Visual Gallery`}
            subtitle="Explore high-resolution spatial details, material studies, and contextual photography"
            theme="light"
            columns={3}
          />
        </section>
      )}
    </motion.div>
  );
};

export default BlogDetail;