import { motion, AnimatePresence } from "framer-motion";
import { BlogCard } from '../components/BlogCard';
import { Link } from 'react-router-dom';

export const posts = [
  {
    id: 1,
    title: "Unlocking Business Efficiency with SaaS Solutions",
    description: "Discover how modern cloud-based software is transforming traditional workflows and driving unprecedented growth in the digital age.",
    category: "Business",
    type: "Guide",
    year: "2024",
    author: "Jennifer Taylor",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
    content: [
      { type: "paragraph", text: "The shift toward Software as a Service (SaaS) isn't just a trend; it's a fundamental restructuring of how businesses operate. By offloading infrastructure management to specialized providers, companies can focus on their core competencies." },
      { type: "heading", text: "Why Efficiency Matters Now" },
      { type: "paragraph", text: "In a post-digital world, speed is the ultimate currency. SaaS solutions allow for instant scaling, real-time collaboration, and data-driven decision-making that traditional on-premise software simply cannot match." },
      { type: "list", items: ["Reduced Upfront Costs", "Automatic Updates", "Global Accessibility", "Enhanced Security Protocols"] }
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
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
    content: [
      { type: "paragraph", text: "From telemedicine platforms that connect rural patients to specialists, to IoT-integrated manufacturing dashboards, SaaS is the engine of the Fourth Industrial Revolution." },
      { type: "heading", text: "The Healthcare Shift" },
      { type: "paragraph", text: "We analyzed three major hospitals that transitioned to cloud-based record-keeping. The result? A 30% reduction in administrative errors and faster patient processing times." }
    ]
  },
  {
    id: 6,
    title: "Mastering UI Elements: A Practical Guide for Designers",
    description: "Dive into the world of user interfaces with our expert guides, latest trends, and practical tips for buttons, cards, and more.",
    category: "Design",
    type: "Tutorial",
    year: "2024",
    author: "Jennifer Taylor",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800",
    content: [
      { type: "paragraph", text: "A great UI is invisible. When a user interacts with a button or a card, they shouldn't have to think about how it works. It should be intuitive." },
      { type: "heading", text: "The Anatomy of a Card" },
      { type: "paragraph", text: "Cards are the building blocks of modern web design. They help group related information and provide a clear entry point for more detailed content." }
    ]
  },
  {
    id: 7,
    title: "Crafting Seamless Experiences: The Art of Intuitive UI",
    description: "Explore the principles and techniques that drive user-centric UI design, ensuring a seamless journey.",
    category: "UX Research",
    type: "Research",
    year: "2024",
    author: "Jennifer Taylor",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    content: [
      { type: "paragraph", text: "Intuition isn't magic—it's the result of following established mental models. In this research, we look at how users navigate unfamiliar interfaces." }
    ]
  },
  {
    id: 8,
    title: "Beyond Aesthetics: The Power of Emotional UX Design",
    description: "Delve into the realm of emotional design and discover how incorporating empathy impacts retention.",
    category: "Psychology",
    type: "Feature",
    year: "2024",
    author: "Ryan A.",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800",
    content: [
      { type: "paragraph", text: "How does a user feel when they encounter an error message? Emotional UX is about designing for the 'lows' just as much as the 'highs'." }
    ]
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
  const recentPosts = posts.slice(6);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Featured stories</h1>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {/* Navigation links like Homepage, About us, etc */}
        </nav>
      </div>

      {/* Hero Section: Large Card + Side List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <div className="lg:col-span-2">
          <BlogCard post={featuredPost} featured={true} />
        </div>
        
        {/* Side List (Other featured posts) */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold border-b pb-2">Other featured posts</h2>
          {sidePosts.map(post => (
            <div key={post.id} className="flex gap-4 group cursor-pointer">
              <img src={post.image} className="w-20 h-20 object-cover rounded-lg" alt="" />
              <div>
                <h4 className="text-sm font-bold leading-snug group-hover:text-[#7db3b8] transition-colors">
                  {post.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="mb-10 flex justify-between items-end">
        <h2 className="text-2xl font-bold">Recent Posts</h2>
        <button className="text-xs font-bold px-4 py-2 border rounded-full hover:bg-slate-50">All Posts</button>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {recentPosts.map((post) => (
             <Link to={`/blog/${post.id}`}>
                 <BlogCard key={post.id} post={post} />
             </Link>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BlogPage;