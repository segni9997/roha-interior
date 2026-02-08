import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface BlogPost {
  image: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  description: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-100 cursor-pointer 
        ${featured ? "h-[400px] sm:h-[500px] md:h-full" : "h-[350px] sm:h-[400px]"}`}
    >
      {/* Image Layer */}
      <img
        src={post.image}
        alt={post.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>

      {/* Floating Category/Year */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2">
        <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-mono uppercase text-white rounded-full">
          {post.category}
        </span>
      </div>

      {/* Glass Content Card */}
      <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3">
        <div className="rounded-lg sm:rounded-xl border border-white/20 bg-white/10 p-3 sm:p-4 md:p-5 backdrop-blur-xl transition-all duration-500 group-hover:bg-white/20">
          <div className="mb-1.5 sm:mb-2 flex items-start justify-between">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter text-[#7db3b8]">
              {post.author} • {post.readTime}
            </span>
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <h3 className={`${featured ? "text-lg sm:text-xl md:text-2xl" : "text-base sm:text-lg"} mb-1.5 sm:mb-2 font-bold leading-tight text-white line-clamp-2`}>
            {post.title}
          </h3>
          <p className="line-clamp-2 text-[11px] sm:text-[12px] leading-relaxed text-white/70 transition-all group-hover:line-clamp-none">
            {post.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};