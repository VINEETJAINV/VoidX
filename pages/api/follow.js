const [isFollowing, setIsFollowing] = useState(false);
// On profile load, check if current user follows this profile
// Add button:
<button
  onClick={handleFollow}
  className={`px-3 py-1 rounded ${isFollowing ? "bg-gray-300" : "bg-indigo-500 text-white"}`}
>
  {isFollowing ? "Unfollow" : "Follow"}
</button>
