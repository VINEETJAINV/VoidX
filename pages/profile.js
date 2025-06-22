import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DarkModeToggle from "../components/DarkmodeToggle";

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState({ name: "", bio: "", avatar_url: "", id: "" });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef();
  const [posts, setPosts] = useState([]);
  const [claps, setClaps] = useState(0);

  // Helper for avatar
  const getAvatar = () => {
    if (avatarUrl) return avatarUrl;
    if (user?.imageUrl) return user.imageUrl;
    if (profile.avatar_url) return profile.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || user?.fullName || "User")}`;
  };

  // Fetch profile and posts
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .get("/api/profile/get", { params: { userId: user.id } })
      .then((res) => {
        const p = res.data || { name: user.fullName, bio: "", avatar_url: getAvatar(), id: user.id };
        setProfile(p);
        setName(p.name);
        setBio(p.bio || "");
        setUid(p.id);
        setAvatarUrl(p.avatar_url || "");
        setLoading(false);
      })
      .catch(async () => {
        const avatar_url = getAvatar();
        await axios.post("/api/profile/update", {
          id: user.id,
          name: user.fullName,
          bio: "",
          avatar_url
        });
        setProfile({ name: user.fullName, bio: "", avatar_url, id: user.id });
        setName(user.fullName);
        setBio("");
        setUid(user.id);
        setAvatarUrl(avatar_url);
        setLoading(false);
      });

    // Fetch user's posts and claps
    axios
      .get("/api/posts/feed")
      .then((res) => {
        const userPosts = res.data.filter((post) => post.user_id === user.id);
        setPosts(userPosts);
        setClaps(userPosts.reduce((sum, post) => sum + (post.total_likes || 0), 0));
      });
  }, [user]);

  // Save profile
  const handleSave = async () => {
    setLoading(true);
    const avatar_url = avatarUrl || getAvatar();
    await axios.post("/api/profile/update", {
      id: uid,
      name,
      bio,
      avatar_url
    });
    setProfile({ ...profile, name, bio, avatar_url, id: uid });
    setEdit(false);
    setLoading(false);
  };

  // Avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setAvatarUrl(data.secure_url);
    setAvatarUploading(false);
  };

  if (!user) return <div className="text-center mt-10 text-lg text-gray-500 dark:text-gray-300">Sign in to view your profile.</div>;
  if (loading) return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff] to-[#ffe4e6] dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="bg-white/70 dark:bg-zinc-900/70 rounded-3xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center animate-pulse">
        <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-zinc-800 mb-6" />
        <div className="h-8 w-2/3 bg-indigo-100 dark:bg-zinc-800 rounded mb-3" />
        <div className="h-4 w-1/2 bg-indigo-100 dark:bg-zinc-800 rounded mb-6" />
        <div className="h-4 w-3/4 bg-indigo-100 dark:bg-zinc-800 rounded mb-3" />
        <div className="h-10 w-full bg-indigo-100 dark:bg-zinc-800 rounded mb-2" />
        <div className="h-10 w-full bg-indigo-100 dark:bg-zinc-800 rounded mb-2" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white/80 dark:bg-zinc-900/80 shadow-md backdrop-blur sticky top-0 z-10 border-b border-indigo-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight drop-shadow">VOIDX</span>
          <span className="ml-2 px-2 py-1 bg-indigo-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-semibold shadow">Beta</span>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
        </div>
      </header>
      <div className="flex justify-center items-center min-h-[80vh] bg-transparent">
        <div className="bg-white/80 dark:bg-zinc-900/80 rounded-3xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center relative backdrop-blur-lg border border-indigo-100 dark:border-zinc-800 transition-all duration-300 mt-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="absolute left-6 top-6 flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full font-semibold shadow hover:scale-105 transition text-sm z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
          <div className="relative mb-6 mt-2">
            <img
              src={getAvatar()}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-300 dark:border-indigo-700 shadow-lg transition-all duration-300"
            />
            {edit && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full font-semibold shadow hover:scale-110 transition text-xs"
                >
                  {avatarUploading ? "..." : "Edit"}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
              </>
            )}
          </div>
          {edit ? (
            <>
              <input
                className="border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-indigo-700 dark:text-indigo-200 rounded-xl p-3 w-full mb-3 text-center text-2xl font-bold focus:ring-2 focus:ring-indigo-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
              />
              <input
                className="border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-300 font-semibold rounded-xl p-3 w-full mb-3 text-center text-base font-mono focus:ring-2 focus:ring-indigo-400"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                maxLength={64}
              />
              <textarea
                className="border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-indigo-700 dark:text-indigo-200 rounded-xl p-3 w-full text-base focus:ring-2 focus:ring-indigo-400 mb-3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={180}
                placeholder="Add a bio..."
              />
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition w-full mb-2"
                disabled={loading}
              >
                Save
              </button>
              <button
                onClick={() => setEdit(false)}
                className="text-gray-400 underline text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-1 transition-all duration-300">{profile.name}</h2>
              <div className="text-blue-500 dark:text-blue-300 text-xs mb-2 font-mono font-semibold break-all">{profile.id}</div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{profile.bio || "No bio yet. Add one!"}</p>
              <button
                onClick={() => setEdit(true)}
                className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition w-full mb-2"
              >
                Edit Profile
              </button>
            </>
          )}
          <div className="w-full mt-8 flex justify-around text-center">
            <div>
              <div className="font-bold text-lg text-indigo-700 dark:text-indigo-300">{posts.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
            </div>
            <div>
              <div className="font-bold text-lg text-pink-500 dark:text-pink-400">{claps}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Claps</div>
            </div>
          </div>
          <div className="w-full mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Posts</h3>
            {posts.length === 0 ? (
              <div className="text-gray-400 text-center">You haven't posted anything yet.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-indigo-50 rounded-xl p-4 shadow">
                    {post.image_url && (
                      <img src={post.image_url} alt="" className="w-full rounded mb-2 max-h-40 object-cover" />
                    )}
                    <div className="text-gray-800">{post.content}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(post.created_at).toLocaleString()}</div>
                    <div className="text-xs text-indigo-600 mt-1">👏 {post.total_likes || 0}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}