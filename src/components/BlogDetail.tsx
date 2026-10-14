import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Loader2, Share2, Sparkles, BookOpen, Building2 } from 'lucide-react';
import { api, resolveImageUrl, type BlogPostItem } from '../services/api';
import { ResponsiveContentGallery } from './ResponsiveContentGallery';
import { FloatingShape, SHAPES } from './FloatingShapes';
import { NavigationOverlay } from './NavBar';
import Footer from './Footer';

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'lead' | 'callout' | 'image_single' | 'two_images' | 'three_images' | 'image_text' | 'gallery' | 'divider';
  text?: string;
  items?: string[];
  [key: string]: any;
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

        if (isMounted) {
          if (live) {
            setPost(live);
          } else {
            // No fallback blogs as explicitly requested
            setPost(null);
          }
        }
      } catch (err) {
        console.warn('Backend detail unavailable:', err);
        if (isMounted) setPost(null);
      } finally {
        if (isMounted) setLoading(false);
      }
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#111f20] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
        <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
          Loading Architectural Monograph...
        </span>
      </div>
    );
  }

  // DEDICATED EMPTY / NOT FOUND STATE (MATCHING MAIN THEME)
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#111f20] text-white font-sans">
        <NavigationOverlay />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-32 text-center max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-[#172a2b] border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(32,91,99,0.3)]">
            <BookOpen className="w-10 h-10 text-cyan-300" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            • Archive Status
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase">
            No Blog Available in Architectural Archive
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed font-light">
            The requested architectural story could not be located in our current studio database. Check back soon for upcoming releases or explore our active portfolio.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg"
            >
              <ArrowLeft size={14} />
              <span>Return to Articles Archive</span>
            </Link>
            <Link
              to="/interior"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono font-bold uppercase tracking-wider transition-all"
            >
              <Building2 size={14} />
              <span>Architectural Projects</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryName = typeof post.category === 'object' ? (post.category as any)?.name : (post.category || 'Architecture');
  const authorName = typeof post.author === 'object' ? (post.author as any)?.name : (post.author || 'ROHA Studio Editorial');
  const authorAvatar = (post.author as any)?.avatar || (post as any)?.author_details?.avatar;
  const coverImage = resolveImageUrl(post.cover_image || post.image, '/tr/279A1756.JPG');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="relative min-h-screen bg-[#111f20] text-white font-sans overflow-hidden selection:bg-[#205b63] selection:text-white"
    >
      <NavigationOverlay />

      {/* Floating 3D Geometric Architectural Shapes */}
      <FloatingShape
        src={SHAPES.diamond}
        size={90}
        top="10%"
        left="5%"
        blur="1px"
        opacity={0.2}
        rotate={-15}
        duration={8}
      />
      <FloatingShape
        src={SHAPES.cone}
        size={95}
        top="22%"
        right="6%"
        blur="2px"
        opacity={0.18}
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
        opacity={0.2}
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
        opacity={0.2}
        rotate={15}
        duration={8.5}
        delay={2}
      />

      {/* Ambient Radial Lighting Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#205b63]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sub-Header Breadcrumb & Navigation Bar */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-28 sm:pt-32 pb-6 flex items-center justify-between">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition-all duration-300 font-mono text-xs uppercase tracking-wider group backdrop-blur-md"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-cyan-300" />
          <span>All Stories</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition-all font-mono text-xs uppercase tracking-wider cursor-pointer backdrop-blur-md"
          title="Copy article URL"
        >
          <Share2 size={13} className="text-cyan-300" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Article Header & Cover */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="px-3.5 py-1.5 bg-[#205b63]/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full shadow-sm">
            {categoryName}
          </span>
          <span className="px-3.5 py-1.5 bg-white/10 text-slate-300 border border-white/15 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full shadow-sm">
            {post.type || "Monograph"}
          </span>
          {post.year && (
            <span className="px-3 py-1.5 text-slate-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
              {post.year}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.12] mb-8 tracking-tight uppercase font-display">
          {post.title}
        </h1>
        
        {/* Featured Cover Image */}
        <div className="relative h-[360px] sm:h-[480px] md:h-[580px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/15 bg-black/40 group">
          <img 
            src={coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111f20]/90 via-transparent to-transparent pointer-events-none" />
        </div>
      </header>

      {/* Content Layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col gap-10 sm:gap-12 mb-20">
        {/* Sidebar Info */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-28 p-6 sm:p-8 rounded-3xl border border-white/15 bg-[#142628]/85 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-black/40 overflow-hidden border border-white/15 shrink-0">
                  <img
                    src={authorAvatar ? resolveImageUrl(authorAvatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=205b63&color=fff`}
                    alt={authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-cyan-300 uppercase font-mono font-bold tracking-wider">Curated by</p>
                  <p className="text-base font-bold text-white">{authorName}</p>
                </div>
              </div>

              <hr className="border-white/10" />

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-cyan-300 font-mono uppercase font-bold mb-1">Published</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Calendar size={13} className="text-cyan-300" /> {post.year || "2026"}
                  </p>
                </div>
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-cyan-300 font-mono uppercase font-bold mb-1">Reading Time</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Clock size={13} className="text-cyan-300" /> {post.readTime || "5 min"}
                  </p>
                </div>
              </div>

              <div className="bg-[#205b63]/20 p-4 rounded-2xl border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-1.5 text-cyan-300 font-mono text-[11px] uppercase font-bold tracking-wider">
                  <Sparkles size={13} />
                  <span>Studio Dialogue</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Have spatial questions or looking to collaborate on bespoke interior or model projects?
                </p>
                <Link to="/contactus" className="inline-block mt-3 text-xs font-mono font-bold text-cyan-300 hover:text-white uppercase tracking-wider hover:underline">
                  Initiate Consultation →
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Article Body (Main Theme Dark Aesthetic) */}
        <main className="lg:col-span-8 order-1 lg:order-2 bg-[#142628]/60 p-8 sm:p-12 rounded-3xl border border-white/10 shadow-xl backdrop-blur-md">
          <div className="prose lg:prose-lg max-w-none text-slate-200">
            {post.description && (
              <p className="text-lg sm:text-xl text-slate-100 leading-relaxed mb-8 italic border-l-4 border-cyan-400 pl-5 py-3 font-medium bg-[#205b63]/15 rounded-r-xl">
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
                        <span className="inline-block px-3 py-1 mb-2.5 rounded-full bg-[#205b63]/25 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                          {block.badge}
                        </span>
                      )}
                      {level === 'h1' ? (
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display uppercase mb-3">
                          {block.text}
                        </h2>
                      ) : level === 'h3' ? (
                        <h4 className="text-xl sm:text-2xl font-bold text-cyan-300 tracking-tight font-display mb-2">
                          {block.text}
                        </h4>
                      ) : (
                        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display mb-3">
                          {block.text}
                        </h3>
                      )}
                      {block.subtitle && (
                        <p className="text-sm sm:text-base text-slate-300 font-light italic">
                          {block.subtitle}
                        </p>
                      )}
                    </div>
                  );
                }

                if (block.type === 'lead') {
                  return (
                    <div key={idx} className="my-6 p-6 rounded-2xl bg-[#205b63]/15 border-l-4 border-cyan-400 border border-cyan-500/25">
                      <p className="text-lg sm:text-xl text-slate-100 leading-relaxed font-serif italic">
                        {block.text}
                      </p>
                    </div>
                  );
                }

                if (block.type === 'paragraph') {
                  return (
                    <p key={idx} className="text-slate-200 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                      {block.text}
                    </p>
                  );
                }

                if (block.type === 'quote') {
                  return (
                    <figure key={idx} className="my-8 p-6 sm:p-8 rounded-2xl bg-amber-950/25 border-l-4 border-amber-400 border border-amber-500/30">
                      <blockquote className="text-lg sm:text-xl font-serif italic text-amber-200 leading-relaxed">
                        &ldquo;{block.text}&rdquo;
                      </blockquote>
                      {(block.author || block.citation || block.role) && (
                        <figcaption className="mt-4 flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                          <span>— {block.author || 'Architectural Commentary'}</span>
                          {(block.role || block.citation) && (
                            <span className="text-amber-400">({block.role || block.citation})</span>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.type === 'callout') {
                  return (
                    <div key={idx} className="my-8 p-6 sm:p-7 rounded-2xl bg-white/5 border border-white/15 shadow-sm">
                      <div className="flex items-center gap-2.5 mb-3 text-cyan-300 font-mono text-xs uppercase font-bold tracking-wider">
                        <Sparkles size={15} className="text-cyan-300" />
                        <span>{block.title || 'Key Architectural Insights'}</span>
                      </div>
                      {block.text && (
                        <p className="text-sm sm:text-base text-slate-200 mb-4 leading-relaxed">
                          {block.text}
                        </p>
                      )}
                      {block.items && block.items.length > 0 && (
                        <ul className="space-y-2 text-sm sm:text-base text-slate-200">
                          {block.items.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
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
                      className={`my-6 space-y-3 text-slate-200 text-base sm:text-lg leading-relaxed pl-6 ${
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
                      <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-md">
                        <img
                          src={resolveImageUrl(block.image)}
                          alt={block.alt || block.caption || 'Architectural monograph image'}
                          className="w-full h-auto object-cover max-h-[500px]"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="mt-2 text-center text-xs font-mono text-slate-400">
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
                        <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-sm">
                          <img
                            src={resolveImageUrl(block.image1)}
                            alt={block.caption1 || 'Monograph image'}
                            className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                          />
                          {block.caption1 && (
                            <p className="p-2.5 text-[11px] font-mono text-slate-300 bg-black/40 border-t border-white/10">
                              {block.caption1}
                            </p>
                          )}
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-sm">
                          <img
                            src={resolveImageUrl(block.image2)}
                            alt={block.caption2 || 'Monograph image'}
                            className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                          />
                          {block.caption2 && (
                            <p className="p-2.5 text-[11px] font-mono text-slate-300 bg-black/40 border-t border-white/10">
                              {block.caption2}
                            </p>
                          )}
                        </div>
                      </div>
                      {block.subtitle && (
                        <figcaption className="mt-2 text-center text-xs font-mono text-slate-400">
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
                          <div key={i} className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-sm">
                            <img
                              src={resolveImageUrl(item.img)}
                              alt={item.cap || `Gallery image ${i + 1}`}
                              className="w-full h-52 sm:h-60 object-cover hover:scale-105 transition-transform duration-500"
                            />
                            {item.cap && (
                              <p className="p-2 text-[10px] font-mono text-slate-300 bg-black/40 border-t border-white/10 truncate">
                                {item.cap}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      {block.subtitle && (
                        <figcaption className="mt-2 text-center text-xs font-mono text-slate-400">
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
                        <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-md">
                          <img
                            src={resolveImageUrl(block.image)}
                            alt={block.title || 'Image'}
                            className="w-full h-64 sm:h-80 object-cover"
                          />
                        </div>
                        {block.caption && (
                          <p className="mt-2 text-xs font-mono text-slate-400 text-center">
                            {block.caption}
                          </p>
                        )}
                      </div>
                      <div className={`md:col-span-6 ${isLeft ? 'order-2' : 'order-1'}`}>
                        {block.title && (
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display tracking-tight">
                            {block.title}
                          </h3>
                        )}
                        <p className="text-slate-200 text-base leading-relaxed">
                          {block.text}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (block.type === 'gallery' && block.images && block.images.length > 0) {
                  return (
                    <div key={idx} className="my-10 pt-4 border-t border-white/10">
                      {block.title && (
                        <h4 className="text-lg font-bold font-display uppercase tracking-wider text-cyan-300 mb-4">
                          {block.title}
                        </h4>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {block.images.map((img: any, i: number) => (
                          <div key={i} className="rounded-xl overflow-hidden border border-white/15 bg-black/40 group shadow-sm">
                            <img
                              src={resolveImageUrl(img.url || img.image || img)}
                              alt={img.caption || `Gallery ${i + 1}`}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {img.caption && (
                              <p className="p-2 text-[10px] font-mono text-slate-300 bg-black/40 truncate">
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
                      <span className="h-px bg-white/15 flex-1" />
                      <span className="w-2.5 h-2.5 rotate-45 border border-cyan-400 bg-cyan-400/40" />
                      <span className="h-px bg-white/15 flex-1" />
                    </div>
                  );
                }

                return null;
              })
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 mt-8 text-white tracking-tight font-display">
                  Architectural Intent & Spatial Harmony
                </h2>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                  In contemporary spatial curation, the dialogue between tectonic materials, natural light, and functional volumes establishes the atmosphere of enduring architecture.
                </p>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                  Our studio balances raw tactile honesty with fine digital manufacturing tolerances, ensuring each residential commission or scaled physical model exemplifies precision.
                </p>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Supplemental High-Res Gallery Images */}
      {post.gallery_images && post.gallery_images.length > 0 && (
        <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20 pt-12 border-t border-white/10">
          <ResponsiveContentGallery
            images={post.gallery_images}
            title={`${post.type || 'Architectural'} Visual Gallery`}
            subtitle="Explore high-resolution spatial photography, material samples, and construction details"
            theme="dark"
            columns={3}
          />
        </section>
      )}

      <Footer />
    </motion.div>
  );
};

export default BlogDetail;