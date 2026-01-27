import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const BlogCard = ({ post, featured = false }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 cursor-pointer 
        ${featured ? "h-[500px] md:h-full" : "h-[400px]"}`}
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
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-mono uppercase text-white rounded-full">
          {post.category}
        </span>
      </div>

      {/* Glass Content Card */}
      <div className="absolute inset-x-3 bottom-3">
        <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl transition-all duration-500 group-hover:bg-white/20">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-[10px] font-black uppercase tracking-tighter text-[#7db3b8]">
              {post.author} • {post.readTime}
            </span>
            <ArrowUpRight className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <h3 className={`${featured ? "text-2xl" : "text-lg"} mb-2 font-bold leading-tight text-white line-clamp-2`}>
            {post.title}
          </h3>
          <p className="line-clamp-2 text-[12px] leading-relaxed text-white/70 transition-all group-hover:line-clamp-none">
            {post.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};