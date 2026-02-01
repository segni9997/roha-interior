import { BlogCard } from '../components/BlogCard';
import { Link } from 'react-router-dom';

// data.ts
import { Post } from './types';
import GeoButton from '../components/Buttons';

export const posts: Post[] = [
  {
    id: 1,
    title: "Unlocking Business Efficiency with SaaS Solutions",
    description: "Discover how modern cloud-based software is transforming traditional workflows and driving growth.",
    category: "Business",
    type: "Guide",
    year: "2024",
    author: "Jennifer Taylor",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
    content: [
      { type: "paragraph", text: "The shift toward Software as a Service (SaaS) isn't just a trend; it's a fundamental restructuring." },
      { type: "heading", text: "Why Efficiency Matters Now" },
      { type: "paragraph", text: "In a post-digital world, speed is the ultimate currency." },
      { type: "list", items: ["Reduced Upfront Costs", "Automatic Updates", "Global Accessibility"] }
    ]
  },
  {
    id: 2,
    title: "Revolutionizing industries through SaaS implementation",
    description: "A deep dive into industry-specific transformations from healthcare to manufacturing.",
    category: "Tech",
    type: "Case Study",
    year: "2024",
    author: "Marcus Chen",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "SaaS is the engine of the Fourth Industrial Revolution." }]
  },
  {
    id: 3,
    title: "The Future of Generative AI in Creative Workflows",
    description: "How AI is moving from a novelty tool to a core component of the designer's toolkit.",
    category: "AI",
    type: "Analysis",
    year: "2024",
    author: "Elena Rossi",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Generative AI is redefining what it means to be a creator." }]
  },
  {
    id: 4,
    title: "Scaling Engineering Teams: Lessons from Silicon Valley",
    description: "The organizational challenges of growing from 10 to 100 developers without losing velocity.",
    category: "Dev",
    type: "Guide",
    year: "2023",
    author: "David Vark",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Scaling isn't just about hiring; it's about communication." }]
  },
  {
    id: 5,
    title: "Minimalism in Modern Dashboard Design",
    description: "Why less is often more when it comes to complex data visualization.",
    category: "Design",
    type: "Opinion",
    year: "2024",
    author: "Sarah Jenkins",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Complexity is the enemy of clarity in dashboard design." }]
  },
  {
    id: 6,
    title: "Mastering UI Elements: A Practical Guide for Designers",
    description: "Dive into the world of user interfaces with our expert guides for buttons and cards.",
    category: "Design",
    type: "Tutorial",
    year: "2024",
    author: "Jennifer Taylor",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "A great UI is invisible and intuitive." }]
  },
  {
    id: 7,
    title: "Crafting Seamless Experiences: The Art of Intuitive UI",
    description: "Explore the principles and techniques that drive user-centric UI design.",
    category: "UX Research",
    type: "Research",
    year: "2024",
    author: "Jennifer Taylor",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Intuition is the result of following established mental models." }]
  },
  {
    id: 8,
    title: "Beyond Aesthetics: The Power of Emotional UX Design",
    description: "Discover how incorporating empathy and psychology impacts user retention.",
    category: "Psychology",
    type: "Feature",
    year: "2024",
    author: "Ryan A.",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Designing for the 'lows' is as important as the 'highs'." }]
  },
  {
    id: 9,
    title: "The Rise of Zero-Config Deployment Tools",
    description: "How Vercel and Netlify changed the way we ship code to production.",
    category: "Dev",
    type: "Trends",
    year: "2024",
    author: "Alex Rivers",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "The DevOps barrier is lowering for every developer." }]
  },
  {
    id: 10,
    title: "Sustainable SaaS: Reducing Carbon Footprints",
    description: "Strategies for optimizing code and server usage for environmental impact.",
    category: "Tech",
    type: "Analysis",
    year: "2023",
    author: "Mia Wong",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Green computing is no longer a niche concern." }]
  },
  {
    id: 11,
    title: "Security by Design in Enterprise Applications",
    description: "Integrating security protocols into the earliest stages of development.",
    category: "Business",
    type: "Guide",
    year: "2024",
    author: "Marcus Chen",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Security is a process, not a product." }]
  },
  {
    id: 12,
    title: "The Death of the Hamburguer Menu?",
    description: "Evaluating the pros and cons of traditional navigation in mobile apps.",
    category: "UX Research",
    type: "Opinion",
    year: "2024",
    author: "Sarah Jenkins",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Users are tired of hiding their navigation." }]
  },
  {
    id: 13,
    title: "Edge Computing and the Future of Latency",
    description: "Why moving logic closer to the user is the next step for high-performance apps.",
    category: "Tech",
    type: "Research",
    year: "2024",
    author: "Alex Rivers",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Latency is the silent killer of user experience." }]
  },
  {
    id: 14,
    title: "Psychology of Dark Patterns in E-Commerce",
    description: "Identifying and avoiding unethical design practices that trick users.",
    category: "Psychology",
    type: "Case Study",
    year: "2023",
    author: "Elena Rossi",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Ethics in design is a long-term competitive advantage." }]
  },
  {
    id: 15,
    title: "TypeScript 5.x: What Developers Need to Know",
    description: "A summary of the most impactful features for enterprise developers.",
    category: "Dev",
    type: "Tutorial",
    year: "2024",
    author: "David Vark",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "TypeScript is evolving faster than ever." }]
  },
  {
    id: 16,
    title: "Building accessible React Components",
    description: "A guide to WAI-ARIA and semantic HTML for modern web frameworks.",
    category: "Design",
    type: "Guide",
    year: "2024",
    author: "Mia Wong",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Accessibility is not a feature; it's a right." }]
  },
  {
    id: 17,
    title: "The State of No-Code in 2024",
    description: "Can visual builders truly replace traditional development for startups?",
    category: "SaaS",
    type: "Trends",
    year: "2024",
    author: "Alex Rivers",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1454165833767-02a698d1316a?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "No-code is reaching its maturation point." }]
  },
  {
    id: 18,
    title: "Effective Onboarding for SaaS Users",
    description: "The first five minutes of a user's experience determine their lifetime value.",
    category: "Business",
    type: "Analysis",
    year: "2024",
    author: "Jennifer Taylor",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Onboarding is the most critical part of the funnel." }]
  },
  {
    id: 19,
    title: "Color Theory in Product Branding",
    description: "How choosing the right palette can drive emotional connection to your brand.",
    category: "Design",
    type: "Feature",
    year: "2023",
    author: "Elena Rossi",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Color is the first thing a user perceives." }]
  },
  {
    id: 20,
    title: "Mastering the Art of Technical Writing",
    description: "How to explain complex systems to both engineers and stakeholders.",
    category: "Dev",
    type: "Tutorial",
    year: "2024",
    author: "Marcus Chen",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000",
    content: [{ type: "paragraph", text: "Writing is a core skill for every senior engineer." }]
  }
];
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