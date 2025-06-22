"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CreatePost({ userId, onPost, userName, userAvatar }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You must be signed in to post.");
      return;
    }
    setLoading(true);
    console.log({
      user_id: userId,
      content,
      image_url: imageUrl,
      user_name: userName,
      user_avatar: userAvatar
    });
    await axios.post("/api/posts/create", {
      user_id: userId,
      content,
      image_url: imageUrl,
      user_name: userName,
      user_avatar: userAvatar
    });
    setContent("");
    setImageUrl("");
    setLoading(false);
    onPost();
    toast.success('Post created!');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setImageUrl(data.secure_url);
    setImageUploading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 bg-white/90 dark:bg-zinc-900/90 p-6 rounded-2xl shadow-xl items-center backdrop-blur border border-indigo-100 dark:border-zinc-800"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <textarea
        className="border border-indigo-200 dark:border-zinc-700 rounded-xl p-3 w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition resize-none h-20"
        placeholder="Share your thought..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={180}
        required
      />
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="flex items-center justify-center gap-2 w-40 px-3 py-1.5 bg-white/80 dark:bg-zinc-800/80 border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 rounded-full font-semibold text-sm shadow hover:bg-indigo-50 dark:hover:bg-zinc-700 hover:scale-105 transition mb-1"
      >
        <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M3 7h2l2-3h10l2 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' />
        </svg>
        {imageUrl ? "Change Image" : "Add Image"}
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        ref={fileInputRef}
      />
      {imageUploading && (
        <div className="text-indigo-600 dark:text-indigo-300 font-semibold mb-2">Uploading image...</div>
      )}
      {imageUrl && (
        <img src={imageUrl} alt="preview" className="w-full max-h-48 object-cover rounded-xl mb-2 shadow border border-indigo-100 dark:border-indigo-700" />
      )}
      <button
        type="submit"
        className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition font-semibold shadow w-full"
        disabled={loading || imageUploading}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </motion.form>
  );
} 