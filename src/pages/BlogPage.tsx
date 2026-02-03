import { BlogCard } from '../components/BlogCard';
import { Link } from 'react-router-dom';

// data.ts

import GeoButton from '../components/Buttons';
import { posts } from '../components/datas/posts';


const BlogPage = () => {
  // Mock Data
//   const posts = [
//   {
//     id: 1,
//     title: "Unlocking Business Efficiency with SaaS Solutions",
//     description: "Discover how modern cloud-based software is transforming traditional workflows and driving unprecedented growth in the digital age.",
//     category: "Business",
//     type: "Guide",
//     year: "2024",
//     author: "Jennifer Taylor",
//     readTime: "8 min read",
//     image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
//   },
//   {
//     id: 2,
//     title: "Revolutionizing industries through SaaS implementation",
//     description: "A deep dive into industry-specific transformations.",
//     category: "Tech",
//     type: "Case Study",
//     year: "2024",
//     author: "Marcus Chen",
//     readTime: "5 min read",
//     image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
//   },
//   {
//     id: 3,
//     title: "Synergizing SaaS and UX design for elevating experiences",
//     description: "Bridging the gap between functionality and user delight.",
//     category: "Design",
//     type: "Analysis",
//     year: "2024",
//     author: "Sarah Jenkins",
//     readTime: "6 min read",
//     image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=400",
//   },
//   {
//     id: 4,
//     title: "Navigating SaaS waters with intuitive UI and UX",
//     description: "Best practices for dashboard navigation.",
//     category: "UX",
//     type: "Trends",
//     year: "2024",
//     author: "Alex Rivers",
//     readTime: "4 min read",
//     image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=400",
//   },
//   {
//     id: 5,
//     title: "Sculpting SaaS success - the art of UI and UX design",
//     description: "Why design is the secret weapon of top companies.",
//     category: "Product",
//     type: "Opinion",
//     year: "2023",
//     author: "Elena Rossi",
//     readTime: "7 min read",
//     image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400",
//   },
//   {
//     id: 6,
//     title: "Mastering UI Elements: A Practical Guide for Designers",
//     description: "Dive into the world of user interfaces with our expert guides, latest trends, and practical tips for buttons, cards, and more.",
//     category: "Design",
//     type: "Tutorial",
//     year: "2024",
//     author: "Jennifer Taylor",
//     readTime: "3 min read",
//     image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: 7,
//     title: "Crafting Seamless Experiences: The Art of Intuitive UI",
//     description: "Explore the principles and techniques that drive user-centric UI design, ensuring a seamless and intuitive journey for users.",
//     category: "UX Research",
//     type: "Research",
//     year: "2024",
//     author: "Jennifer Taylor",
//     readTime: "5 min read",
//     image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: 8,
//     title: "Beyond Aesthetics: The Power of Emotional UX Design",
//     description: "Delve into the realm of emotional design and discover how incorporating empathy and psychology impacts retention.",
//     category: "Psychology",
//     type: "Feature",
//     year: "2024",
//     author: "Ryan A.",
//     readTime: "2 min read",
//     image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800",
//   }
// ];


  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 6);
  // const recentPosts = posts.slice(6);


  return (
    <div className="relative max-w-full mx-auto px-6 py-12 bg-[#f5f7f7]">
      {/* Header */}

         <div className="absolute -top-12 left-1/2 md:left-10 flex items-center gap-4 z-30">
          <div className="h-[6px] w-12 bg-[#205b63]"></div>
          <span className="md:text-4xl text-xs font-black uppercase tracking-[0.5em] text-[#205b63]">
            Featured stories
          </span>
        </div>
      {/* <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Featured stories</h1>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
        </nav>
      </div> */}

      {/* Hero Section: Large Card + Side List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <div className="lg:col-span-2">
           <Link to={`/blog/${featuredPost.id}`}>
            <BlogCard post={featuredPost} featured={true} />
           </Link>
        </div>
        
        {/* Side List (Other featured posts) */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold border-b pb-2">Other featured posts</h2>
          {sidePosts.map(post => (
           <Link to={`/blog/${post.id}`}>
 <div key={post.id} className="flex gap-4 group cursor-pointer">
              <img src={post.image} className="w-20 h-20 object-cover rounded-lg" alt="" />
              <div>
                <h4 className="text-sm font-bold leading-snug group-hover:text-[#7db3b8] transition-colors">
                  {post.title}
                </h4>
              </div>
            </div>
            
           </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="mb-10 flex justify-end items-end">
        <Link to="/allblogs">
      <GeoButton label='all Posts' isuppercase='capitalize' from='172a2b' to='fff'/>
        </Link>
      </div>

      {/* <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {recentPosts.map((post) => (
             <Link to={`/blog/${post.id}`}>
                 <BlogCard key={post.id} post={post} />
             </Link>
          ))}
        </AnimatePresence>
      </motion.div> */}
    </div>
  );
};

export default BlogPage;