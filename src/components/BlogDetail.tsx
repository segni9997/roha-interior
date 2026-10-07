import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Loader2, Share2, Sparkles, BookOpen } from 'lucide-react';
import { posts as fallbackPosts } from './datas/posts';
import { api, resolveImageUrl, type BlogPostItem } from '../services/api';
import { ResponsiveContentGallery } from './ResponsiveContentGallery';
import { FloatingShape, SHAPES } from './FloatingShapes';
import { NavigationOverlay } from './NavBar';
import Footer from './Footer';

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'quote';
  text?: string;
  items?: string[];
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPost() {
      if (!id) return;
      try {
        setLoading(true);
        const parsedId = parseInt(id, 10);
        let live: BlogPostItem | null = null;
        
        if (!isNaN(parsedId)) {
          live = await api.getBlogPost(parsedId).catch(() => null);
        }
        
        if (!live) {
          const allPosts = await api.getBlogPosts().catch(() => []);
          live = allPosts.find((p) => String(p.id) === id || p.slug === id) || null;
        }

        if (isMounted && live) {
          setPost(live);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Backend detail unavailable, using fallback post:', err);
      }

      const fb = fallbackPosts.find((p) => String(p.id) === id || (p as any).slug === id) || fallbackPosts[0];
      if (isMounted && fb) {
        setPost({
          ...fb,
          slug: String(fb.id),
          image: fb.image,
          content: fb.content as any
        });
      }
      if (isMounted) setLoading(false);
    }
    loadPost();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const parsedContent = useMemo<ContentBlock[]>(() => {
    if (!post?.content) return [];
    if (Array.isArray(post.content)) return post.content as ContentBlock[];
    if (typeof post.content === 'string') {
      try {
        const parsed = JSON.parse(post.content);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [{ type: 'paragraph', text: post.content }];
      }
    }
    return [];
  }, [post?.content]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc] text-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-[#205b63]" />
        <span className="text-xs font-mono font-bold tracking-widest text-slate-600 uppercase">
          Loading Architectural Monograph...
        </span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#f8fafc] text-slate-900 px-6 text-center">
        <BookOpen className="w-12 h-12 text-[#205b63] opacity-70" />
        <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900">Article Not Found</h2>
        <p className="text-sm text-slate-600 max-w-md">
          The requested architectural story or research paper could not be located in our current studio archive.
        </p>
        <Link
          to="/allblogs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#205b63] hover:bg-[#172a2b] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg"
        >
          <ArrowLeft size={14} />
          <span>Return to Articles Archive</span>
        </Link>
      </div>
    );
  }

  const categoryName = typeof post.category === 'object' ? (post.category as any)?.name : (post.category || 'Architecture');
  const authorName = typeof post.author === 'object' ? (post.author as any)?.name : (post.author || 'ROHA Studio Editorial');
  const authorAvatar = (post.author as any)?.avatar || (post as any)?.author_details?.avatar;
  const coverImage = resolveImageUrl(post.cover_image || post.image, '/pexels-chudin-alexey-26964541.jpg');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="relative min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] text-slate-900 overflow-hidden"
    >
      <NavigationOverlay />

      {/* Floating 3D Geometric Architectural Shapes */}
      <FloatingShape
        src={SHAPES.diamond}
        size={90}
        top="10%"
        left="5%"
        blur="1px"
        opacity={0.25}
        rotate={-15}
        duration={8}
      />
      <FloatingShape
        src={SHAPES.cone}
        size={95}
        top="22%"
        right="6%"
        blur="2px"
        opacity={0.2}
        rotate={25}
        duration={9.5}
        delay={0.8}
      />
      <FloatingShape
        src={SHAPES.cubeAlt1}
        size={70}
        top="55%"
        left="6%"
        blur="none"
        opacity={0.25}
        rotate={-25}
        duration={7}
        delay={1.5}
      />
      <FloatingShape
        src={SHAPES.cylinder}
        size={75}
        top="75%"
        right="8%"
        blur="1px"
        opacity={0.25}
        rotate={15}
        duration={8.5}
        delay={2}
      />

      {/* Ambient Radial Lighting Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#205b63]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Sub-Header Breadcrumb & Navigation Bar */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-28 sm:pt-32 pb-6 flex items-center justify-between">
        <Link 
          to="/allblogs" 
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-sm transition-all duration-300 font-mono text-xs uppercase tracking-wider group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#205b63]" />
          <span>All Stories</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-sm transition-all font-mono text-xs uppercase tracking-wider cursor-pointer"
          title="Copy article URL"
        >
          <Share2 size={13} className="text-[#205b63]" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Article Header & Cover */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="px-3.5 py-1.5 bg-[#205b63]/10 text-[#205b63] border border-[#205b63]/25 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full shadow-sm">
            {categoryName}
          </span>
          <span className="px-3.5 py-1.5 bg-slate-200/70 text-slate-700 border border-slate-300/60 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full shadow-sm">
            {post.type || "Monograph"}
          </span>
          {post.year && (
            <span className="px-3 py-1.5 text-slate-500 text-[11px] font-mono font-semibold uppercase tracking-wider">
              {post.year}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.12] mb-8 tracking-tight uppercase font-display">
          {post.title}
        </h1>
        
        {/* Featured Cover Image */}
        <div className="relative h-[360px] sm:h-[480px] md:h-[580px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-200/80 bg-slate-100 group">
          <img 
            src={coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </header>

      {/* Content Layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col gap-10 sm:gap-12 mb-20">
        {/* Sidebar Info */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-28 p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src={authorAvatar ? resolveImageUrl(authorAvatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=205b63&color=fff`}
                    alt={authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-[#205b63] uppercase font-mono font-bold tracking-wider">Curated by</p>
                  <p className="text-base font-bold text-slate-900">{authorName}</p>
                </div>
              </div>

              <hr className="border-slate-200" />

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                  <p className="text-[10px] text-[#205b63] font-mono uppercase font-bold mb-1">Published</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#205b63]" /> {post.year || "2026"}
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                  <p className="text-[10px] text-[#205b63] font-mono uppercase font-bold mb-1">Reading Time</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock size={13} className="text-[#205b63]" /> {post.readTime || "5 min"}
                  </p>
                </div>
              </div>

              <div className="bg-[#205b63]/5 p-4 rounded-2xl border border-[#205b63]/20">
                <div className="flex items-center gap-2 mb-1.5 text-[#205b63] font-mono text-[11px] uppercase font-bold tracking-wider">
                  <Sparkles size={13} />
                  <span>Studio Dialogue</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Have spatial questions or looking to collaborate on bespoke interior or model projects?
                </p>
                <Link to="/contactus" className="inline-block mt-3 text-xs font-mono font-bold text-[#205b63] hover:text-[#172a2b] uppercase tracking-wider hover:underline">
                  Initiate Consultation →
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Article Body */}
        <main className="lg:col-span-8 order-1 lg:order-2 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
          <div className="prose lg:prose-lg max-w-none text-slate-800">
            {post.description && (
              <p className="text-lg sm:text-xl text-slate-800 leading-relaxed mb-8 italic border-l-4 border-[#205b63] pl-5 py-3 font-medium bg-[#205b63]/5 rounded-r-xl">
                {post.description}
              </p>
            )}

            {parsedContent.length > 0 ? (
              parsedContent.map((block: any, idx) => {
                if (block.type === 'heading') {
                  const level = block.level || 'h2';
                  return (
                    <div key={idx} className="my-8 first:mt-2">
                      {block.badge && (
                        <span className="inline-block px-3 py-1 mb-2.5 rounded-full bg-[#205b63]/10 text-[#205b63] border border-[#205b63]/25 text-[10px] font-mono font-bold uppercase tracking-wider">
                          {block.badge}
                        </span>
                      )}
                      {level === 'h1' ? (
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-display uppercase mb-3">
                          {block.text}
                        </h2>
                      ) : level === 'h3' ? (
                        <h4 className="text-xl sm:text-2xl font-bold text-[#205b63] tracking-tight font-display mb-2">
                          {block.text}
                        </h4>
                      ) : (
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display mb-3">
                          {block.text}
                        </h3>
                      )}
                      {block.subtitle && (
                        <p className="text-sm sm:text-base text-slate-600 font-light italic">
                          {block.subtitle}
                        </p>
                      )}
                    </div>
                  );
                }

                if (block.type === 'lead') {
                  return (
                    <div key={idx} className="my-6 p-6 rounded-2xl bg-[#205b63]/5 border-l-4 border-[#205b63] border border-[#205b63]/20">
                      <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-serif italic">
                        {block.text}
                      </p>
                    </div>
                  );
                }

                if (block.type === 'paragraph') {
                  return (
                    <p key={idx} className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                      {block.text}
                    </p>
                  );
                }

                if (block.type === 'quote') {
                  return (
                    <figure key={idx} className="my-8 p-6 sm:p-8 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 border border-amber-200">
                      <blockquote className="text-lg sm:text-xl font-serif italic text-amber-950 leading-relaxed">
                        &ldquo;{block.text}&rdquo;
                      </blockquote>
                      {(block.author || block.citation || block.role) && (
                        <figcaption className="mt-4 flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-800">
                          <span>— {block.author || 'Architectural Commentary'}</span>
                          {(block.role || block.citation) && (
                            <span className="text-amber-700">({block.role || block.citation})</span>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.type === 'callout') {
                  return (
                    <div key={idx} className="my-8 p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm">
                      <div className="flex items-center gap-2.5 mb-3 text-[#205b63] font-mono text-xs uppercase font-bold tracking-wider">
                        <Sparkles size={15} className="text-[#205b63]" />
                        <span>{block.title || 'Key Architectural Insights'}</span>
                      </div>
                      {block.text && (
                        <p className="text-sm sm:text-base text-slate-700 mb-4 leading-relaxed">
                          {block.text}
                        </p>
                      )}
                      {block.items && block.items.length > 0 && (
                        <ul className="space-y-2 text-sm sm:text-base text-slate-700">
                          {block.items.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#205b63] shrink-0 mt-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }

                if (block.type === 'list') {
                  const isNumbered = block.listType === 'number';
                  const ListTag = isNumbered ? 'ol' : 'ul';
                  return (
                    <ListTag
                      key={idx}
                      className={`my-6 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed pl-6 ${
                        isNumbered ? 'list-decimal' : 'list-disc'
                      }`}
                    >
                      {(block.items || []).map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ListTag>
                  );
                }

                if (block.type === 'image_single') {
                  return (
                    <figure key={idx} className="my-8">
                      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
                        <img
                          src={resolveImageUrl(block.image)}
                          alt={block.alt || block.caption || 'Architectural monograph image'}
                          className="w-full h-auto object-cover max-h-[500px]"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="mt-2 text-center text-xs font-mono text-slate-500">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.type === 'two_images') {
                  return (
                    <figure key={idx} className="my-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                          <img
                            src={resolveImageUrl(block.image1)}
                            alt={block.caption1 || 'Monograph image'}
                            className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                          />
                          {block.caption1 && (
                            <p className="p-2.5 text-[11px] font-mono text-slate-600 bg-white border-t border-slate-200">
                              {block.caption1}
                            </p>
                          )}
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                          <img
                            src={resolveImageUrl(block.image2)}
                            alt={block.caption2 || 'Monograph image'}
                            className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                          />
                          {block.caption2 && (
                            <p className="p-2.5 text-[11px] font-mono text-slate-600 bg-white border-t border-slate-200">
                              {block.caption2}
                            </p>
                          )}
                        </div>
                      </div>
                      {block.subtitle && (
                        <figcaption className="mt-2 text-center text-xs font-mono text-slate-500">
                          {block.subtitle}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.type === 'three_images') {
                  return (
                    <figure key={idx} className="my-8">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { img: block.image1, cap: block.caption1 },
                          { img: block.image2, cap: block.caption2 },
                          { img: block.image3, cap: block.caption3 },
                        ].map((item, i) => (
                          <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                            <img
                              src={resolveImageUrl(item.img)}
                              alt={item.cap || `Gallery image ${i + 1}`}
                              className="w-full h-52 sm:h-60 object-cover hover:scale-105 transition-transform duration-500"
                            />
                            {item.cap && (
                              <p className="p-2 text-[10px] font-mono text-slate-600 bg-white border-t border-slate-200 truncate">
                                {item.cap}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      {block.subtitle && (
                        <figcaption className="mt-2 text-center text-xs font-mono text-slate-500">
                          {block.subtitle}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.type === 'image_text') {
                  const isLeft = block.imagePosition !== 'right';
                  return (
                    <div key={idx} className="my-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className={`md:col-span-6 ${isLeft ? 'order-1' : 'order-2'}`}>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
                          <img
                            src={resolveImageUrl(block.image)}
                            alt={block.title || 'Image'}
                            className="w-full h-64 sm:h-80 object-cover"
                          />
                        </div>
                        {block.caption && (
                          <p className="mt-2 text-xs font-mono text-slate-500 text-center">
                            {block.caption}
                          </p>
                        )}
                      </div>
                      <div className={`md:col-span-6 ${isLeft ? 'order-2' : 'order-1'}`}>
                        {block.title && (
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-display tracking-tight">
                            {block.title}
                          </h3>
                        )}
                        <p className="text-slate-700 text-base leading-relaxed">
                          {block.text}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (block.type === 'gallery' && block.images && block.images.length > 0) {
                  return (
                    <div key={idx} className="my-10 pt-4 border-t border-slate-200">
                      {block.title && (
                        <h4 className="text-lg font-bold font-display uppercase tracking-wider text-[#205b63] mb-4">
                          {block.title}
                        </h4>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {block.images.map((img: any, i: number) => (
                          <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
                            <img
                              src={resolveImageUrl(img.url || img.image || img)}
                              alt={img.caption || `Gallery ${i + 1}`}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {img.caption && (
                              <p className="p-2 text-[10px] font-mono text-slate-600 bg-white truncate">
                                {img.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (block.type === 'divider') {
                  return (
                    <div key={idx} className="my-10 flex items-center justify-center gap-4">
                      <span className="h-px bg-slate-300 flex-1" />
                      <span className="w-2.5 h-2.5 rotate-45 border border-[#205b63] bg-[#205b63]" />
                      <span className="h-px bg-slate-300 flex-1" />
                    </div>
                  );
                }

                return null;
              })
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 mt-8 text-slate-900 tracking-tight font-display">
                  Architectural Intent & Spatial Harmony
                </h2>
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                  In contemporary spatial curation, the dialogue between tectonic materials, natural light, and functional volumes establishes the atmosphere of enduring architecture.
                </p>
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                  Our studio balances raw tactile honesty with fine digital manufacturing tolerances, ensuring each residential commission or scaled physical model exemplifies precision.
                </p>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Supplemental High-Res Gallery Images */}
      {post.gallery_images && post.gallery_images.length > 0 && (
        <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20 pt-12 border-t border-slate-200">
          <ResponsiveContentGallery
            images={post.gallery_images}
            title={`${post.type || 'Architectural'} Visual Gallery`}
            subtitle="Explore high-resolution spatial photography, material samples, and construction details"
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