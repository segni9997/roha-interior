import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';
import { posts as fallbackPosts } from './datas/posts';
import { api, resolveImageUrl, type BlogPostItem } from '../services/api';
import { ResponsiveContentGallery } from './ResponsiveContentGallery';
import { FloatingShape, SHAPES } from './FloatingShapes';
import Footer from './Footer';

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
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <h2 className="text-2xl font-bold text-slate-900">Article not found</h2>
        <Link to="/allblogs" className="text-[#205b63] underline font-medium">Return to Articles</Link>
      </div>
    );
  }

  const coverImage = resolveImageUrl(post.cover_image || post.image, '/pexels-chudin-alexey-26964541.jpg');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="relative min-h-screen bg-[#f8fafc] text-slate-900 overflow-hidden"
    >
      {/* Floating 3D Geometric Shapes with varied blur, sizes and positions */}
      <FloatingShape
        src={SHAPES.diamond}
        size={90}
        top="8%"
        left="4%"
        blur="1px"
        opacity={0.3}
        rotate={-15}
        duration={8}
      />
      <FloatingShape
        src={SHAPES.cone}
        size={85}
        top="18%"
        right="5%"
        blur="2px"
        opacity={0.25}
        rotate={25}
        duration={9.5}
        delay={0.8}
      />
      <FloatingShape
        src={SHAPES.cubeAlt1}
        size={65}
        top="55%"
        left="6%"
        blur="none"
        opacity={0.3}
        rotate={-25}
        duration={7}
        delay={1.5}
      />
      <FloatingShape
        src={SHAPES.cylinder}
        size={70}
        top="70%"
        right="8%"
        blur="1px"
        opacity={0.3}
        rotate={15}
        duration={8.5}
        delay={2}
      />

      {/* Subtle Architectural Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link 
          to="/allblogs" 
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 hover:bg-[#205b63] text-slate-700 hover:text-white border border-slate-200 hover:border-[#205b63] shadow-sm transition-all duration-300 font-medium text-xs uppercase tracking-wider group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </Link>

        <div className="flex items-center gap-2">
          <img src="/roha.png" alt="ROHA" className="w-7 h-7 object-contain" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-600 uppercase">ROHA Journal</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3.5 py-1.5 bg-[#205b63]/10 text-[#205b63] border border-[#205b63]/25 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full shadow-sm">
            {post.category || "Architecture"}
          </span>
          <span className="px-3.5 py-1.5 bg-slate-200/80 text-slate-700 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full shadow-sm">
            {post.type || "Case Study"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight uppercase">
          {post.title}
        </h1>
        
        {/* Featured Cover Image */}
        <div className="relative h-[360px] sm:h-[480px] md:h-[600px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-200 bg-slate-100">
          <img 
            src={coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Content Layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 mb-20">
        {/* Sidebar Info */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-10 p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-md">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || "ROHA")}&background=205b63&color=fff`} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] text-[#205b63] uppercase font-mono font-bold tracking-wider">Curated by</p>
                  <p className="text-base font-bold text-slate-900">{post.author || "ROHA Studio Editorial"}</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-[#205b63] font-mono uppercase font-bold mb-1">Publication Year</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><Calendar size={14} className="text-slate-500" /> {post.year || "2026"}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-[#205b63] font-mono uppercase font-bold mb-1">Reading Time</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><Clock size={14} className="text-slate-500" /> {post.readTime || "5 min"}</p>
                </div>
              </div>

              <div className="bg-[#205b63]/5 p-4 rounded-2xl border border-[#205b63]/15">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Have inquiries or want to discuss this architectural methodology?
                </p>
                <Link to="/contactus" className="inline-block mt-3 text-xs font-mono font-bold text-[#205b63] hover:underline uppercase">
                  Schedule Studio Consultation →
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Article Body */}
        <main className="lg:col-span-8 order-1 lg:order-2 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md">
          <div className="prose prose-slate lg:prose-lg max-w-none">
            {post.description && (
              <p className="text-lg sm:text-xl text-slate-800 leading-relaxed mb-8 italic border-l-4 border-[#205b63] pl-5 py-1 font-medium bg-[#205b63]/5 rounded-r-xl">
                {post.description}
              </p>
            )}

            {post.content && post.content.length > 0 ? (
              post.content.map((block, idx) => {
                if (block.type === 'heading') {
                  return <h2 key={idx} className="text-2xl sm:text-3xl font-black mb-4 mt-8 text-slate-900 tracking-tight">{block.text}</h2>;
                }
                if (block.type === 'paragraph') {
                  return <p key={idx} className="text-slate-800 text-base sm:text-lg leading-relaxed mb-6 font-normal">{block.text}</p>;
                }
                if (block.type === 'list' && block.items) {
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-3 text-slate-800 text-base sm:text-lg mb-6 leading-relaxed">
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
                <h2 className="text-2xl sm:text-3xl font-black mb-4 mt-8 text-slate-900 tracking-tight">The Architectural Philosophy</h2>
                <p className="text-slate-800 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                  In the rapidly evolving landscape of architectural curation, the synthesis between light, raw materiality, and spatial flow defines contemporary design.
                </p>
                <p className="text-slate-800 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                  Our practice honors the tactile nature of construction. Whether designing monolithic residential volumes or executing micro-tolerance presentation models, precision remains paramount to spatial integrity.
                </p>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Supplemental Responsive Gallery Images */}
      {post.gallery_images && post.gallery_images.length > 0 && (
        <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20 pt-12 border-t border-slate-200">
          <ResponsiveContentGallery
            images={post.gallery_images}
            title={`${post.type || 'Architectural'} Visual Gallery`}
            subtitle="Explore high-resolution spatial details, material studies, and contextual photography"
            theme="light"
            columns={3}
          />
        </section>
      )}

      <Footer />
    </motion.div>
  );
};

export default BlogDetail;