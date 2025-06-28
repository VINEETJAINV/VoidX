import { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import DarkModeToggle from "../components/DarkmodeToggle";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchPosts = () => {
    setLoading(true);
    console.log('Fetching posts...');
    axios.get("/api/posts/feed")
      .then((res) => {
        console.log('Posts fetched successfully:', res.data);
        setPosts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        console.error('Error response:', error.response?.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (postId, count) => {
    axios.post("/api/posts/like", { postId, count }).then(fetchPosts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white/80 dark:bg-zinc-900/80 shadow-md backdrop-blur sticky top-0 z-10 border-b border-indigo-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight drop-shadow">VOIDX</span>
          <span className="ml-2 px-2 py-1 bg-indigo-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-semibold shadow">Beta</span>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <SignedOut>
            <SignInButton>
              <button className="mx-2 px-5 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-700 text-white font-semibold shadow hover:bg-indigo-700 dark:hover:bg-indigo-800 transition">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-5 py-2 rounded-lg bg-pink-500 dark:bg-pink-600 text-white font-semibold shadow hover:bg-pink-600 dark:hover:bg-pink-700 transition">
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <nav className="flex items-center gap-4">
              <Link href="#feed" legacyBehavior>
                <a className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline">Feed</a>
              </Link>
              <Link href="/profile" legacyBehavior>
                <a className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline">Profile</a>
              </Link>
              <UserButton />
            </nav>
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 drop-shadow-lg">
          Welcome to <span className="text-indigo-600 dark:text-indigo-300">VOIDX</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          The next-gen social platform. Share your thoughts, connect, and express yourself with a beautiful, modern experience.
        </p>
        <SignedOut>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton>
              <button className="px-8 py-3 rounded-lg bg-pink-500 dark:bg-pink-600 text-white font-bold shadow-lg hover:bg-pink-600 dark:hover:bg-pink-700 transition text-lg">
                Get Started
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="px-8 py-3 rounded-lg bg-indigo-600 dark:bg-indigo-700 text-white font-bold shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition text-lg">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Welcome, {user?.firstName || user?.username || "User"}!</h2>
            <div className="flex gap-4">
              <Link href="#feed" legacyBehavior>
                <a className="px-7 py-2 rounded-xl font-bold shadow-lg bg-white/20 dark:bg-zinc-900/40 border-2 border-transparent bg-clip-padding backdrop-blur-md text-indigo-700 dark:text-indigo-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:scale-105 transition-all duration-200 ring-1 ring-indigo-200 dark:ring-indigo-700"
                  style={{ background: "linear-gradient(90deg, #6366f1 0%, #a21caf 100%)", color: "#fff", boxShadow: "0 4px 24px 0 rgba(80,80,200,0.10)" }}>
                  Feed
                </a>
              </Link>
              <Link href="/profile" legacyBehavior>
                <a className="px-7 py-2 rounded-xl font-bold shadow-lg bg-white/20 dark:bg-zinc-900/40 border-2 border-transparent bg-clip-padding backdrop-blur-md text-pink-600 dark:text-pink-300 hover:border-pink-400 dark:hover:border-pink-500 hover:scale-105 transition-all duration-200 ring-1 ring-pink-200 dark:ring-pink-700"
                  style={{ background: "linear-gradient(90deg, #ec4899 0%, #6366f1 100%)", color: "#fff", boxShadow: "0 4px 24px 0 rgba(200,80,200,0.10)" }}>
                  Profile
                </a>
              </Link>
            </div>
          </div>
        </SignedIn>
      </section>

      {/* Feed Section */}
      <main id="feed" className="max-w-xl mx-auto mt-8">
        <SignedOut>
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Sign in to create and like posts!
          </div>
        </SignedOut>
        <SignedIn>
          <div className="mb-8">
            <CreatePost
              userId={user?.id}
              userName={user?.fullName}
              userAvatar={user?.imageUrl}
              onPost={fetchPosts}
            />
          </div>
        </SignedIn>
        {loading ? (
          <div className="flex flex-col gap-4 mt-10">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white/80 dark:bg-zinc-900/80 rounded-2xl p-4 mb-8 shadow-xl animate-pulse flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-zinc-800" />
                  <div className="h-4 w-1/3 bg-indigo-100 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-40 w-full bg-indigo-100 dark:bg-zinc-800 rounded-xl mb-2" />
                <div className="h-6 w-2/3 bg-indigo-100 dark:bg-zinc-800 rounded mb-2" />
                <div className="h-8 w-1/4 bg-indigo-100 dark:bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 mt-10">
            No posts yet. Be the first to post!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))
        )}
      </main>
      <footer className="text-center text-gray-400 dark:text-gray-600 py-8 text-sm">
        &copy; {new Date().getFullYear()} VOIDX. All rights reserved.
      </footer>
    </div>
  );
} 