import React, { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Send, Music, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Reel } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ReelsViewProps {
  reels: Reel[];
  onLikeReel: (reelId: string) => void;
}

export default function ReelsView({ reels, onLikeReel }: ReelsViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentsMap, setCommentsMap] = useState<Record<string, { username: string; text: string }[]>>({
    reel_1: [
      { username: "gigi_style", text: "Packing my bags right now! Balinese sunsets are unreal." },
      { username: "wander_joe", text: "Is this near Ubud? Tell me the coordinates!" }
    ],
    reel_2: [
      { username: "aris_lens", text: "Stunning color grade. That lens captures everything so cleanly." },
      { username: "synth_rider", text: "Song choice is absolute perfection! ⚡🌌" }
    ],
    reel_3: [
      { username: "minimal_space", text: "Love the trench coat silhouette! Adding it to my moodboard." }
    ]
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Auto-play / pause based on active index
  useEffect(() => {
    reels.forEach((reel, index) => {
      const video = videoRefs.current[reel.id];
      if (video) {
        if (index === activeIndex) {
          if (isPlaying) {
            video.play().catch((err) => console.log("Play failed: ", err));
          } else {
            video.pause();
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [activeIndex, isPlaying, reels]);

  // Handle scroll snap events to update active index
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop;
    const height = container.clientHeight;
    const newIndex = Math.round(scrollPosition / height);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reels.length) {
      setActiveIndex(newIndex);
      setIsPlaying(true); // Auto play newly active reel
    }
  };

  const handleVideoClick = (reelId: string) => {
    setIsPlaying(!isPlaying);
  };

  const handleAddComment = (reelId: string) => {
    if (!newComment.trim()) return;
    const list = commentsMap[reelId] || [];
    setCommentsMap({
      ...commentsMap,
      [reelId]: [...list, { username: "you_explore", text: newComment }]
    });
    setNewComment("");
  };

  const triggerShareToast = () => {
    setToastMessage("Transmission shared successfully with aesthetic circles.");
    setShowShareModal(null);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div id="reels-view-root" className="w-full h-full max-w-md mx-auto bg-black flex flex-col items-center justify-center relative rounded-3xl overflow-hidden select-none border border-white/5 shadow-2xl">
      
      {/* Toast notification overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-4 right-4 z-50 bg-zinc-950/90 border border-white/10 p-3 rounded-xl shadow-lg backdrop-blur text-center"
          >
            <p className="text-[10px] tracking-widest font-bold text-amber-200 uppercase">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Mute Toggle indicator overlay */}
      <button 
        id="btn-reels-global-mute"
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-40 bg-black/40 hover:bg-black/60 p-2.5 rounded-full text-white cursor-pointer border border-white/10 transition"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Vertical Snapping Reels Stream */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {reels.map((reel, index) => (
          <div 
            key={reel.id} 
            className="w-full h-full snap-start relative flex flex-col justify-end bg-zinc-950"
            style={{ height: "100%" }}
          >
            {/* The Video Source */}
            <video 
              ref={(el) => { videoRefs.current[reel.id] = el; }}
              src={reel.videoUrl} 
              loop
              muted={isMuted}
              playsInline
              onClick={() => handleVideoClick(reel.id)}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />

            {/* Play overlay indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
                <div className="bg-black/55 p-5 rounded-full text-white scale-110">
                  <Pause size={30} fill="white" />
                </div>
              </div>
            )}

            {/* Dark gradient for bottom details readable legibility */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

            {/* LOWER LEFT: Author, caption & rotating music track */}
            <div className="absolute bottom-6 left-4 right-16 z-20 text-white flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-0.5 rounded-full border border-white/10 bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-100">
                    {reel.username[0].toUpperCase()}
                  </div>
                </div>
                <span className="font-semibold text-sm drop-shadow">{reel.username}</span>
                <button className="bg-white/5 hover:bg-white/10 active:scale-95 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border border-white/10 transition cursor-pointer">
                  Follow
                </button>
              </div>

              <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed drop-shadow font-normal">
                {reel.caption}
              </p>

              {/* Music Ticker */}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md self-start px-3 py-1.5 rounded-full border border-white/10 max-w-[180px] overflow-hidden">
                <Music size={11} className="text-zinc-300 shrink-0" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-200 truncate inline-block animate-pulse">
                  {reel.musicTrack}
                </span>
              </div>
            </div>

            {/* RIGHT SIDEBAR: Action Panel buttons */}
            <div className="absolute bottom-8 right-3 z-20 flex flex-col items-center gap-5">
              
              {/* Creator's Avatar circle */}
              <div className="relative group cursor-pointer mb-2">
                <div className="p-0.5 rounded-full border border-white/10 bg-white/5 shadow-md">
                  <div className="w-10 h-10 rounded-full bg-zinc-850 flex items-center justify-center font-semibold text-white">
                    {reel.username[0].toUpperCase()}
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-zinc-950">
                  +
                </div>
              </div>

              {/* Like action */}
              <button 
                id={`btn-reel-like-${reel.id}`}
                onClick={() => onLikeReel(reel.id)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="bg-black/40 backdrop-blur-md p-3.5 rounded-full text-white border border-white/10 hover:bg-black/60 hover:scale-105 transition transform">
                  <Heart 
                    size={20} 
                    fill={reel.hasLiked ? "#ef4444" : "none"} 
                    className={reel.hasLiked ? "text-red-500 scale-110" : "text-white"} 
                  />
                </div>
                <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">
                  {reel.likesCount + (reel.hasLiked ? 1 : 0)}
                </span>
              </button>

              {/* Comments trigger */}
              <button 
                id={`btn-reel-comment-trigger-${reel.id}`}
                onClick={() => setShowComments(reel.id)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="bg-black/40 backdrop-blur-md p-3.5 rounded-full text-white border border-white/10 hover:bg-black/60 hover:scale-105 transition transform">
                  <MessageCircle size={20} />
                </div>
                <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">
                  {(commentsMap[reel.id] || []).length}
                </span>
              </button>

              {/* Share trigger */}
              <button 
                id={`btn-reel-share-trigger-${reel.id}`}
                onClick={() => setShowShareModal(reel.id)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="bg-black/40 backdrop-blur-md p-3.5 rounded-full text-white border border-white/10 hover:bg-black/60 hover:scale-105 transition transform">
                  <Send size={20} />
                </div>
                <span className="text-[10px] font-medium text-white/90 mt-1 uppercase tracking-wider text-[9px]">Share</span>
              </button>

              {/* Spinning Vinyl Record Disc */}
              <div className="mt-2 w-9 h-9 rounded-full bg-zinc-900 border-[3px] border-white/10 flex items-center justify-center animate-spin" style={{ animationDuration: "5s" }}>
                <div className="w-3.5 h-3.5 rounded-full bg-black flex items-center justify-center border border-zinc-750">
                  <Music size={7} className="text-zinc-500" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Slide-Up Overlay: Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            id="reels-comments-drawer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 z-50 bg-[#050505] border-t border-white/10 rounded-t-3xl max-h-[60%] flex flex-col p-5 text-white"
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3">
              <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-300">Comments ({(commentsMap[showComments] || []).length})</h3>
              <button 
                id="btn-close-reels-comments"
                onClick={() => setShowComments(null)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition cursor-pointer text-xs uppercase tracking-wider font-bold"
              >
                Close
              </button>
            </div>

            {/* Comment Stream scroll */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1 no-scrollbar">
              {(commentsMap[showComments] || []).map((comment, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[10px] shrink-0 border border-white/5">
                    {comment.username[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold mr-1.5 hover:underline cursor-pointer">{comment.username}</span>
                    <span className="text-zinc-200 leading-relaxed break-all">{comment.text}</span>
                  </div>
                </div>
              ))}
              {(commentsMap[showComments] || []).length === 0 && (
                <p className="text-center text-xs text-zinc-500 py-6">No comments yet. Start the conversation!</p>
              )}
            </div>

            {/* Comment Form inputs */}
            <div className="pt-3 border-t border-white/5 mt-2 flex gap-2">
              <input 
                id="input-reel-comment"
                type="text" 
                placeholder="Add comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-zinc-950 border border-white/10 rounded-full py-2 px-4 text-xs outline-none focus:border-white/20 transition text-white"
              />
              <button 
                id="btn-post-reel-comment"
                onClick={() => handleAddComment(showComments)}
                disabled={!newComment.trim()}
                className="bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Post
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal Dialog overlay */}
      <AnimatePresence>
        {showShareModal && (
          <div id="reels-share-modal" className="absolute inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#050505] border border-white/10 rounded-3xl w-full max-w-xs p-6 flex flex-col text-white"
            >
              <h3 className="font-bold text-xs uppercase tracking-widest mb-4 text-center text-zinc-300">Share Transmission</h3>
              
              <div className="space-y-3.5 mb-5">
                {[
                  { name: "Gigi Style Advisor", tag: "@gigi_style" },
                  { name: "Aris Photographer", tag: "@aris_lens" },
                  { name: "Zack Fitness Coach", tag: "@fitness_zack" },
                  { name: "Luna Astrologer", tag: "@luna_mystic" }
                ].map((user, idx) => (
                  <label key={idx} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[10px]">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{user.name}</p>
                        <p className="text-[10px] text-zinc-550">{user.tag}</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="rounded border-white/10 bg-zinc-950 text-white focus:ring-0 cursor-pointer"
                      defaultChecked={idx === 0}
                    />
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  id="btn-cancel-reel-share"
                  onClick={() => setShowShareModal(null)}
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-xs py-2 rounded-full transition font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  id="btn-confirm-reel-share"
                  onClick={triggerShareToast}
                  className="flex-1 bg-white text-black hover:bg-zinc-200 text-xs py-2 rounded-full transition font-bold uppercase tracking-wider cursor-pointer"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
