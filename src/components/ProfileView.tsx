import { useState } from "react";
import { Grid, Bookmark, Film, Edit, Check } from "lucide-react";
import { Post } from "../types";

interface ProfileViewProps {
  posts: Post[];
  onOpenDetail: (post: Post) => void;
}

export default function ProfileView({ posts, onOpenDetail }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"grid" | "saved">("grid");
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState("Aesthetic Explorer");
  const [profileBio, setProfileBio] = useState("Visual Architect & Prompt Explorer. Crafting aesthetic digital sanctuaries. 🪐🎨 #MinimalMindset #Design");

  // Filter posts that are published by "you_explore"
  const myPosts = posts.filter((p) => p.username === "you_explore");
  
  // Filter posts bookmarked by user
  const savedPosts = posts.filter((p) => p.hasBookmarked);

  const displayPosts = activeTab === "grid" ? myPosts : savedPosts;

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  return (
    <div id="profile-view-root" className="w-full max-w-2xl mx-auto flex flex-col p-4 md:p-8 select-none text-zinc-100">
      
      {/* 1. Header Profile details */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 pb-8 border-b border-white/5 mb-6">
        
        {/* Avatar circle */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/15 p-1.5 shadow-2xl shrink-0 bg-white/5">
          <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-serif italic text-2xl text-amber-100/90 tracking-tighter border border-white/10">
            ye
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 text-center md:text-left space-y-4 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center md:justify-start">
            <h2 className="font-semibold text-white text-base tracking-widest uppercase">you_explore</h2>
            
            <div className="flex gap-2">
              <button
                id="btn-edit-profile-toggle"
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer text-zinc-300 hover:text-white"
              >
                {isEditing ? (
                  <>
                    <Check size={11} className="text-amber-200" />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Edit size={11} className="text-zinc-400" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Inline Profile Editor */}
          {isEditing ? (
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 max-w-md mx-auto md:mx-0">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-zinc-500 uppercase mb-1">DISPLAY NAME</label>
                <input
                  id="input-edit-profile-name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-white/20 transition"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-zinc-500 uppercase mb-1">BIOGRAPHY</label>
                <textarea
                  id="textarea-edit-profile-bio"
                  rows={2}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white/20 transition resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-200 text-xs tracking-wide">{profileName}</h3>
              <p className="text-zinc-400 text-xs max-w-md leading-relaxed whitespace-pre-wrap">{profileBio}</p>
            </div>
          )}

          {/* Social Stats Counters Row */}
          <div className="flex justify-around md:justify-start gap-8 border-t border-white/5 md:border-none pt-4 md:pt-0">
            <div className="text-center md:text-left">
              <span className="font-extrabold text-sm text-zinc-100">{myPosts.length}</span>
              <span className="text-[9px] text-zinc-500 block sm:inline sm:ml-1.5 tracking-widest uppercase font-bold">posts</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-extrabold text-sm text-zinc-100">12.8k</span>
              <span className="text-[9px] text-zinc-500 block sm:inline sm:ml-1.5 tracking-widest uppercase font-bold">followers</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-extrabold text-sm text-zinc-100">482</span>
              <span className="text-[9px] text-zinc-500 block sm:inline sm:ml-1.5 tracking-widest uppercase font-bold">following</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Grid Tabs filtering */}
      <div className="flex justify-center border-b border-white/5 mb-6">
        <button
          id="btn-tab-my-grid"
          onClick={() => setActiveTab("grid")}
          className={`flex items-center gap-2 py-3.5 px-6 text-[10px] font-bold tracking-widest transition border-b-2 uppercase cursor-pointer ${
            activeTab === "grid" 
              ? "border-amber-200 text-white" 
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Grid size={12} />
          <span>MY POSTS</span>
        </button>
        
        <button
          id="btn-tab-saved"
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 py-3.5 px-6 text-[10px] font-bold tracking-widest transition border-b-2 uppercase cursor-pointer ${
            activeTab === "saved" 
              ? "border-amber-200 text-white" 
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Bookmark size={12} />
          <span>SAVED</span>
        </button>
      </div>

      {/* 3. Grid Display block */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {displayPosts.map((post) => (
          <div
            id={`profile-post-card-${post.id}`}
            key={post.id}
            onClick={() => onOpenDetail(post)}
            className="group relative aspect-square bg-zinc-900/20 rounded-2xl overflow-hidden border border-white/5 cursor-pointer shadow-lg hover:shadow-2xl transition duration-300"
          >
            <img 
              src={post.imageUrl} 
              alt={post.caption} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Overlay indicators on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4 text-white font-bold text-xs">
              <span className="flex items-center gap-1.5 uppercase tracking-widest text-[9px] font-extrabold text-amber-200">
                <Bookmark size={12} fill="currentColor" />
                <span>Saved</span>
              </span>
            </div>
          </div>
        ))}
        {displayPosts.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-500 text-xs">
            {activeTab === "grid" 
              ? "No posts created yet. Go to Create tab to share something!" 
              : "No bookmarked posts yet. Browse discover feeds to save favorites."}
          </div>
        )}
      </div>

    </div>
  );
}
