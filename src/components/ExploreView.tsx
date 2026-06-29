import React, { useState } from "react";
import { Search, Heart, MessageCircle, Bookmark, Sparkles, X, Send } from "lucide-react";
import { Post } from "../types";

interface ExploreViewProps {
  posts: Post[];
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onUpdateComments: (postId: string, newComments: any[]) => void;
}

export default function ExploreView({ posts, onLikePost, onBookmarkPost, onAddComment, onUpdateComments }: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [userComment, setUserComment] = useState("");
  const [isGeneratingComments, setIsGeneratingComments] = useState(false);

  const trendingTags = ["#Aesthetic", "#Wanderlust", "#QuietNature", "#SlowLiving", "#Minimal", "#Cyberpunk", "#TokyoMidnight"];

  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase();
    return (
      post.caption.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.username.toLowerCase().includes(q) ||
      (post.location && post.location.toLowerCase().includes(q))
    );
  });

  const handleOpenDetail = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
    setUserComment("");
  };

  // Ask AI Persona to react (Comment Generator)
  const handleGenerateAIComments = async (postId: string) => {
    if (!selectedPost) return;
    setIsGeneratingComments(true);
    try {
      const response = await fetch("/api/gemini/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: selectedPost.caption,
          theme: selectedPost.category
        })
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      
      if (data.comments && data.comments.length > 0) {
        // Map the structure back to our local Comment format
        const formatted = data.comments.map((c: any, index: number) => ({
          id: `ai_${Date.now()}_${index}`,
          username: c.username,
          text: c.text,
          timestamp: "Just now",
          avatarColor: c.avatarColor || "bg-pink-500"
        }));
        
        onUpdateComments(postId, formatted);
        
        // Synchronize selected post comments array so it updates immediately in the UI
        setSelectedPost((prev) => prev ? {
          ...prev,
          comments: [...prev.comments, ...formatted]
        } : null);
      }
    } catch (err) {
      console.error("AI Comment generation error:", err);
      // Nice static backup comments
      const formatted = [
        { id: `ai_${Date.now()}_1`, username: "daily_grind", text: "Incredible shot! Added this to my daily inspiration boards. 🔥", timestamp: "Just now", avatarColor: "bg-blue-500" },
        { id: `ai_${Date.now()}_2`, username: "cozy_latte", text: "Simply gorgeous! The lighting has such warm healing energy. ☕🍂", timestamp: "Just now", avatarColor: "bg-amber-600" }
      ];
      onUpdateComments(postId, formatted);
      setSelectedPost((prev) => prev ? {
        ...prev,
        comments: [...prev.comments, ...formatted]
      } : null);
    } finally {
      setIsGeneratingComments(false);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim() || !selectedPost) return;

    onAddComment(selectedPost.id, userComment.trim());
    
    // Local state sync
    const newCommentObj = {
      id: Date.now().toString(),
      username: "you_explore",
      text: userComment.trim(),
      timestamp: "Just now",
      avatarColor: "bg-indigo-500"
    };
    setSelectedPost((prev) => prev ? {
      ...prev,
      comments: [...prev.comments, newCommentObj]
    } : null);

    setUserComment("");
  };

  // Helper function to return visual layouts for bento grid
  const getBentoSpan = (index: number) => {
    // stagger spans nicely (row-span-2, col-span-2)
    if (index % 5 === 0) return "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto";
    if (index % 5 === 3) return "md:row-span-2 aspect-[3/4] md:aspect-auto";
    return "aspect-square";
  };

  return (
    <div id="explore-view-root" className="w-full h-full max-w-4xl mx-auto flex flex-col p-4 md:p-8 select-none text-zinc-100">
      
      {/* Search Input section */}
      <div className="relative mb-6 w-full max-w-lg mx-auto">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          id="input-explore-search"
          type="text"
          placeholder="Search keywords, categories, or aesthetic tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-3.5 pl-11 pr-5 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-white/20 transition shadow-inner"
        />
      </div>

      {/* Hashtag Chips */}
      <div className="flex flex-wrap gap-2 justify-center items-center mb-6 py-3 border-b border-white/5">
        <span className="text-[9px] text-zinc-500 font-bold tracking-widest mr-1.5 uppercase">Trending:</span>
        {trendingTags.map((tag) => (
          <button
            id={`btn-tag-${tag.substring(1)}`}
            key={tag}
            onClick={() => setSearchQuery(tag)}
            className="text-[9px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 px-3.5 text-zinc-450 hover:text-white transition cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid container with staggered sizes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 flex-1">
        {filteredPosts.map((post, index) => (
          <div
            id={`explore-post-card-${post.id}`}
            key={post.id}
            onClick={() => handleOpenDetail(post)}
            className={`group relative overflow-hidden bg-zinc-900/20 rounded-2xl border border-white/5 cursor-pointer shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5 ${getBentoSpan(index)}`}
          >
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Hover details mask */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-6 z-10 text-white">
              <span className="flex items-center gap-1.5 text-xs font-bold">
                <Heart size={14} fill="white" />
                <span>{post.likesCount + (post.hasLiked ? 1 : 0)}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold">
                <MessageCircle size={14} />
                <span>{post.comments.length}</span>
              </span>
            </div>
            
            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 text-[8px] font-bold text-zinc-300 tracking-wider">
              {post.category.toUpperCase()}
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-16 text-zinc-500 text-xs">
            No matching posts found. Try searching for "Travel", "Tokyo", or "Minimal".
          </div>
        )}
      </div>

      {/* Lightbox / Post Detail View Modal */}
      {selectedPost && (
        <div id="explore-lightbox-modal" className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#050505] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] shadow-2xl relative">
            
            {/* Top right escape button */}
            <button
              id="btn-close-lightbox"
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 z-40 bg-black/40 hover:bg-black/60 text-white hover:text-white p-1.5 rounded-full border border-white/5 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Left side Image */}
            <div className="w-full md:w-[55%] bg-black flex items-center justify-center border-r border-white/10">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.caption}
                className="max-h-[40vh] md:max-h-[85vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right side Metadata forms stream */}
            <div className="w-full md:w-[45%] flex flex-col justify-between bg-[#050505] max-h-[45vh] md:max-h-none">
              
              {/* Header profile row */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#050505]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
                    {selectedPost.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">{selectedPost.username}</h3>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{selectedPost.location || "Cosmos"}</p>
                  </div>
                </div>

                <div className="bg-white/5 px-2.5 py-1 rounded-full text-[8px] font-bold text-amber-105/75 border border-white/10 tracking-widest uppercase">
                  {selectedPost.category.toUpperCase()}
                </div>
              </div>

              {/* Middle core detail & comments section */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                
                {/* Core original Caption */}
                <div className="flex gap-2.5 items-start text-xs border-b border-white/5 pb-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {selectedPost.username[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold mr-1.5">{selectedPost.username}</span>
                    <span className="text-zinc-200 leading-relaxed">{selectedPost.caption}</span>
                    <span className="text-[9px] text-zinc-500 block mt-2">{selectedPost.timestamp}</span>
                  </div>
                </div>

                {/* Simulated AI comment engine trigger panel */}
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[10px] font-bold text-amber-200 flex items-center gap-1 uppercase tracking-widest">
                      <Sparkles size={10} />
                      <span>AI Comment Reacts</span>
                    </h4>
                    <p className="text-[8px] text-zinc-400 mt-0.5">Let simulated AI personas evaluate this post.</p>
                  </div>
                  <button
                    id="btn-ask-ai-comments"
                    onClick={() => handleGenerateAIComments(selectedPost.id)}
                    disabled={isGeneratingComments}
                    className="bg-white/10 hover:bg-white/15 text-amber-100 hover:text-white active:scale-95 text-[9px] font-bold uppercase tracking-widest px-3.5 py-1.5 border border-white/10 rounded-full transition disabled:opacity-40 shadow shrink-0 cursor-pointer"
                  >
                    {isGeneratingComments ? "CURATING..." : "GENERATE"}
                  </button>
                </div>

                {/* Comment list */}
                <div className="space-y-3 pt-2">
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2.5 items-start text-xs">
                      <div className={`w-7 h-7 rounded-full ${comment.avatarColor || "bg-zinc-800"} flex items-center justify-center font-bold text-[10px] shrink-0 text-white`}>
                        {comment.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-100 leading-relaxed">
                          <span className="font-bold mr-1.5 hover:underline cursor-pointer">{comment.username}</span>
                          <span className="break-all">{comment.text}</span>
                        </p>
                        <span className="text-[8px] text-zinc-500 block mt-1">{comment.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Quick-actions bar (Like, comment submission) */}
              <div className="p-4 border-t border-white/10 bg-[#050505] flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-4 text-zinc-400">
                    <button
                      id="btn-lightbox-like"
                      onClick={() => onLikePost(selectedPost.id)}
                      className="hover:text-white transition cursor-pointer"
                    >
                      <Heart
                        size={18}
                        fill={selectedPost.hasLiked ? "#ef4444" : "none"}
                        className={selectedPost.hasLiked ? "text-red-500 scale-110" : "text-zinc-400"}
                      />
                    </button>
                    <button className="hover:text-white transition cursor-default">
                      <MessageCircle size={18} />
                    </button>
                  </div>
                  
                  <button
                    id="btn-lightbox-bookmark"
                    onClick={() => onBookmarkPost(selectedPost.id)}
                    className="text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    <Bookmark
                      size={18}
                      fill={selectedPost.hasBookmarked ? "white" : "none"}
                      className={selectedPost.hasBookmarked ? "text-white" : "text-zinc-400"}
                    />
                  </button>
                </div>

                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                  {selectedPost.likesCount + (selectedPost.hasLiked ? 1 : 0)} likes
                </p>

                {/* Message Submission form */}
                <form onSubmit={handleSubmitComment} className="flex gap-2">
                  <input
                    id="input-lightbox-comment"
                    type="text"
                    placeholder="Add comment..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-white/10 rounded-full py-2 px-4 text-xs text-zinc-100 placeholder-zinc-550 outline-none focus:border-white/20 transition"
                  />
                  <button
                    id="btn-lightbox-send-comment"
                    type="submit"
                    disabled={!userComment.trim()}
                    className="bg-white hover:bg-zinc-200 active:scale-95 text-[#050505] p-2 rounded-full transition flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer"
                  >
                    <Send size={12} />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
