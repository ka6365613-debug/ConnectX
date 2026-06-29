import React, { useState, useEffect, useRef } from "react";
import { X, Play, Pause, ChevronLeft, ChevronRight, Send, Heart } from "lucide-react";
import { Story } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
}

export default function StoryViewer({ stories, initialIndex, onClose, onStoryViewed }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStory = stories[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Mark story as viewed on active
  useEffect(() => {
    if (currentStory && onStoryViewed) {
      onStoryViewed(currentStory.id);
    }
  }, [currentIndex, currentStory, onStoryViewed]);

  // Reset progress and handle timer when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Animated story timer logic
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 50; // Update every 50ms
    const totalTime = 4000; // 4 seconds per story
    const increment = (interval / totalTime) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Restart current story
      setProgress(0);
    }
  };

  const handleSendReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40, // random percentage X offset
    };
    setReactions((prev) => [...prev, newReaction]);

    // Cleanup reaction after 2s
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    // Simulate sending reply
    handleSendReaction("📩");
    setReplyText("");
    
    // Resume story playback
    setIsPlaying(true);
  };

  if (!currentStory) return null;

  return (
    <div id="story-viewer-root" className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center select-none md:p-4">
      {/* Background blur container */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl pointer-events-none" 
        style={{ backgroundImage: `url(${currentStory.mediaUrl})` }}
      />

      {/* Main active container */}
      <div className="relative w-full h-full max-w-md bg-zinc-900 md:rounded-2xl md:h-[85vh] overflow-hidden flex flex-col justify-between shadow-2xl">
        
        {/* Progress bar container */}
        <div className="absolute top-3 left-0 right-0 z-20 flex gap-1 px-3">
          {stories.map((story, idx) => (
            <div key={story.id} className="h-[3px] flex-1 bg-zinc-600/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{ 
                  width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%" 
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className={`p-[1.5px] rounded-full bg-gradient-to-tr ${currentStory.avatarColor || 'from-pink-500 via-purple-500 to-yellow-500'}`}>
              <img 
                src={currentStory.userAvatar} 
                alt={currentStory.username} 
                className="w-8 h-8 rounded-full border border-black object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-white font-medium text-sm drop-shadow">{currentStory.username}</span>
            <span className="text-white/60 text-xs drop-shadow">active</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              id="btn-play-pause"
              onClick={() => setIsPlaying(!isPlaying)} 
              className="text-white hover:text-white/80 p-1 transition"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button 
              id="btn-close-story"
              onClick={onClose} 
              className="text-white hover:text-white/80 p-1 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tapping Overlay zones */}
        <div className="absolute inset-x-0 top-16 bottom-20 z-10 flex">
          <div 
            id="story-tap-left"
            onClick={handlePrev} 
            className="w-1/3 h-full cursor-left-arrow active:bg-white/5 transition duration-75"
          />
          <div 
            id="story-tap-pause"
            onMouseDown={() => setIsPlaying(false)}
            onMouseUp={() => setIsPlaying(true)}
            onTouchStart={() => setIsPlaying(false)}
            onTouchEnd={() => setIsPlaying(true)}
            className="w-1/3 h-full"
          />
          <div 
            id="story-tap-right"
            onClick={handleNext} 
            className="w-1/3 h-full cursor-right-arrow active:bg-white/5 transition duration-75"
          />
        </div>

        {/* Navigation Arrows (Desktop view only) */}
        <button 
          id="btn-story-prev"
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="absolute left-[-50px] top-1/2 -translate-y-1/2 bg-zinc-800/80 p-2 rounded-full text-white hover:bg-zinc-700/80 disabled:opacity-0 transition hidden md:flex items-center justify-center z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          id="btn-story-next"
          onClick={handleNext} 
          disabled={currentIndex === stories.length - 1}
          className="absolute right-[-50px] top-1/2 -translate-y-1/2 bg-zinc-800/80 p-2 rounded-full text-white hover:bg-zinc-700/80 disabled:opacity-0 transition hidden md:flex items-center justify-center z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Main Content View */}
        <div className="w-full h-full flex items-center justify-center bg-black">
          <img 
            src={currentStory.mediaUrl} 
            alt="Story content" 
            className="max-h-full max-w-full object-contain pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Floating reactions animations container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
          <AnimatePresence>
            {reactions.map((reaction) => (
              <motion.div
                key={reaction.id}
                initial={{ y: "100%", opacity: 0, scale: 0.5 }}
                animate={{ y: "20%", opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                style={{ left: `${reaction.x}%` }}
                className="absolute bottom-20 text-3xl drop-shadow-md filter select-none"
              >
                {reaction.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Interactive Area */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-3">
          
          {/* Reaction Bubbles */}
          <div className="flex justify-around items-center bg-black/40 backdrop-blur-sm rounded-full py-2 px-3 border border-white/10">
            {["❤️", "🙌", "🔥", "😂", "😮", "😍"].map((emoji) => (
              <button 
                id={`btn-react-${emoji}`}
                key={emoji} 
                onClick={() => handleSendReaction(emoji)}
                className="text-2xl hover:scale-125 active:scale-95 transition duration-150 transform cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Quick Chat Input */}
          <form onSubmit={handleSendReply} className="flex gap-2 items-center">
            <input 
              id="input-story-reply"
              type="text" 
              placeholder={`Reply to ${currentStory.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPlaying(false)}
              onBlur={() => setIsPlaying(true)}
              className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-full py-2.5 px-4 text-white placeholder-white/50 text-sm outline-none focus:border-white/50 transition"
            />
            {replyText.trim() && (
              <button 
                id="btn-story-send"
                type="submit" 
                className="bg-white text-black p-2.5 rounded-full hover:bg-neutral-200 active:scale-95 transition flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
