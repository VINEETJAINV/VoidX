import { useState } from "react";
import { motion } from "framer-motion";

export default function PostCard({ post, onLike }) {
  const [clapAnim, setClapAnim] = useState(false);

  const handleClap = () => {
    setClapAnim(true);
    onLike(post.id, 1);
    setTimeout(() => setClapAnim(false), 300);
  };

  return (
    <motion.div
      className="border-none rounded-2xl p-4 mb-8 bg-white/90 dark:bg-zinc-900/90 shadow-xl flex flex-col gap-2 transition-transform hover:scale-[1.01] backdrop-blur border border-indigo-100 dark:border-zinc-800"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <img
          src={post.user_avatar}
          alt=""
          className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-700 shadow"
        />
        <span className="font-semibold text-indigo-700 dark:text-indigo-400">{post.user_name}</span>
      </div>
      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          className="rounded-xl mb-2 max-h-60 object-cover w-full shadow-lg border border-indigo-100 dark:border-indigo-700"
        />
      )}
      <div className="mb-2 text-gray-800 dark:text-gray-200 text-lg font-medium">{post.content}</div>
      <div className="flex gap-4 items-center">
        <button
          className={`px-4 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full font-semibold shadow hover:scale-110 transition flex items-center gap-2 ${clapAnim ? 'ring-2 ring-pink-400 scale-110' : ''}`}
          onClick={handleClap}
        >
          <motion.span
            role="img"
            aria-label="clap"
            animate={{ scale: clapAnim ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            👏
          </motion.span> {post.total_likes}
        </button>
        <span className="ml-2 text-gray-400 cursor-pointer hover:text-indigo-500 transition">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/></svg>
        </span>
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(post.created_at).toLocaleString()}</div>
    </motion.div>
  );
} 