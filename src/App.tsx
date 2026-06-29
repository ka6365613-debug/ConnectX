import React, { useState, useEffect } from "react";
import { 
  Home, 
  Search, 
  PlusSquare, 
  Film, 
  MessageCircle, 
  User, 
  Sparkles, 
  Heart, 
  Bookmark, 
  Share2, 
  MapPin, 
  Send,
  Compass,
  MessageSquare
} from "lucide-react";
import { Post, Story, Reel, DMConversation, TabType } from "./types";
import { INITIAL_POSTS, INITIAL_STORIES, INITIAL_REELS, INITIAL_AI_COMPANIONS, MOCK_AVATARS } from "./data";

// Sub Components
import StoryViewer from "./components/StoryViewer";
import ReelsView from "./components/ReelsView";
import DirectMessages from "./components/DirectMessages";
import CreatePost from "./components/CreatePost";
import ExploreView from "./components/ExploreView";
import ProfileView from "./components/ProfileView";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  
  // Initialize DM Conversations with greeting messages
  const [conversations, setConversations] = useState<DMConversation[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  
  // For Lightbox detail modal in Profile & Feed
  const [lightboxPost, setLightboxPost] = useState<Post | null>(null);
  const [userCommentText, setUserCommentText] = useState<Record<string, string>>({});
  const [isGeneratingCommentsMap, setIsGeneratingCommentsMap] = useState<Record<string, boolean>>({});

  // Float double tap hearts state mapping
  const [doubleTapPostId, setDoubleTapPostId] = useState<string | null>(null);

  useEffect(() => {
    // Generate initial conversational context
    const initialConvs: DMConversation[] = INITIAL_AI_COMPANIONS.map((companion) => ({
      id: `conv_${companion.id}`,
      botId: companion.id,
      botName: companion.name,
      botAvatar: companion.name[0],
      avatarColor: companion.avatarColor,
      botPersona: companion.persona,
      lastMessage: companion.greeting,
      lastTimestamp: "Just now",
      messages: [
        {
          id: `greet_${companion.id}`,
          sender: "bot",
          text: companion.greeting,
          timestamp: "Just now"
        }
      ]
    }));
    setConversations(initialConvs);
  }, []);

  // Post created handler
  const handleAddPost = (postData: {
    imageUrl: string;
    caption: string;
    category: string;
    location: string;
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      username: "you_explore",
      userAvatar: MOCK_AVATARS[2],
      avatarColor: "bg-indigo-500",
      imageUrl: postData.imageUrl,
      category: postData.category,
      caption: postData.caption,
      location: postData.location,
      likesCount: 0,
      hasLiked: false,
      hasBookmarked: false,
      timestamp: "Just now",
      comments: []
    };

    setPosts([newPost, ...posts]);
    setActiveTab("feed"); // Redirect to home feed immediately
  };

  // Like a post handler
  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const hasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked,
            likesCount: post.likesCount + (hasLiked ? 1 : -1)
          };
        }
        return post;
      })
    );
  };

  // Double tap heart gesture triggers
  const handleDoubleTap = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId && !post.hasLiked) {
          return {
            ...post,
            hasLiked: true,
            likesCount: post.likesCount + 1
          };
        }
        return post;
      })
    );
    setDoubleTapPostId(postId);
    setTimeout(() => {
      setDoubleTapPostId(null);
    }, 1000);
  };

  // Bookmark a post handler
  const handleBookmarkPost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            hasBookmarked: !post.hasBookmarked
          };
        }
        return post;
      })
    );
  };

  // Add Comment on Feed Post handler
  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `comment_${Date.now()}`,
      username: "you_explore",
      text,
      timestamp: "Just now",
      avatarColor: "bg-indigo-500"
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  // Custom bulk Comments updates (AI Comment reactions sync)
  const handleUpdateComments = (postId: string, newComments: any[]) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, ...newComments]
          };
        }
        return post;
      })
    );
  };

  // Story Viewed tracker
  const handleStoryViewed = (storyId: string) => {
    setStories(
      stories.map((story) => {
        if (story.id === storyId) {
          return { ...story, hasViewed: true };
        }
        return story;
      })
    );
  };

  // Reels like
  const handleLikeReel = (reelId: string) => {
    setReels(
      reels.map((reel) => {
        if (reel.id === reelId) {
          const hasLiked = !reel.hasLiked;
          return {
            ...reel,
            hasLiked,
            likesCount: reel.likesCount + (hasLiked ? 1 : -1)
          };
        }
        return reel;
      })
    );
  };

  // Send Direct Message handler
  const handleSendMessage = (botId: string, text: string, sender: "user" | "bot") => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender,
      text,
      timestamp: "Just now"
    };

    setConversations(
      conversations.map((conv) => {
        if (conv.botId === botId) {
          return {
            ...conv,
            lastMessage: text,
            lastTimestamp: "Just now",
            messages: [...conv.messages, newMsg],
            unread: sender === "bot"
          };
        }
        return conv;
      })
    );
  };

  // Inline submit form handler on post
  const handleInlineCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const txt = userCommentText[postId];
    if (!txt || !txt.trim()) return;

    handleAddComment(postId, txt.trim());
    setUserCommentText({
      ...userCommentText,
      [postId]: ""
    });
  };

  // Generates comments automatically using full-stack API
  const handleFeedPostAIComments = async (postId: string, postCaption: string, postCategory: string) => {
    setIsGeneratingCommentsMap((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = await fetch("/api/gemini/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: postCaption,
          theme: postCategory
        })
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      
      if (data.comments && data.comments.length > 0) {
        const formatted = data.comments.map((c: any, index: number) => ({
          id: `ai_feed_${Date.now()}_${index}`,
          username: c.username,
          text: c.text,
          timestamp: "Just now",
          avatarColor: c.avatarColor || "bg-pink-500"
        }));
        
        handleUpdateComments(postId, formatted);
      }
    } catch (err) {
      console.error("AI Feed Comments error:", err);
      // Nice mock fallback comments
      const backupComments = [
        { id: `ai_f_b1`, username: "wander_heart", text: "Incredible frame! Giving such cozy minimalist vibes. ✨🏔️", timestamp: "Just now", avatarColor: "bg-blue-400" },
        { id: `ai_f_b2`, username: "design_curator", text: "Brilliant color grading! Love it.", timestamp: "Just now", avatarColor: "bg-indigo-400" }
      ];
      handleUpdateComments(postId, backupComments);
    } finally {
      setIsGeneratingCommentsMap((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div id="app-shell" className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans selection:bg-white selection:text-black">
      
      {/* SIDEBAR NAVIGATION (Desktop size layout) */}
      <aside className="hidden md:flex md:w-64 border-r border-white/10 flex-col justify-between p-8 bg-[#050505] shrink-0 sticky top-0 h-screen select-none">
        <div className="space-y-12">
          
          {/* Logo Title banner matching Aether theme */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-amber-200">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <h1 className="text-2xl font-serif italic tracking-tighter text-white">instavibe.</h1>
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-4">
            {[
              { id: "feed", label: "Horizon", icon: Home },
              { id: "explore", label: "Discovery", icon: Search },
              { id: "create", label: "Transmission", icon: PlusSquare },
              { id: "reels", label: "Cinematics", icon: Film },
              { id: "messages", label: "Transmissions", icon: MessageCircle },
              { id: "profile", label: "My Profile", icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  id={`sidebar-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-xs tracking-wider transition uppercase duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-white/5 text-white border border-white/10 shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info bottom rail footer matching Julian Vane card layout */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-400 flex items-center justify-center font-bold text-xs text-white">
              YE
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-100 truncate">you_explore</p>
              <p className="text-xs text-zinc-500 truncate">@you_explore</p>
            </div>
          </div>
        </div>
      </aside>

      {/* TOP HEADER (Mobile viewport only) */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-white/10 bg-[#050505] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-amber-200">
            <Sparkles size={12} />
          </div>
          <h1 className="text-xl font-serif italic tracking-tighter text-white">instavibe.</h1>
        </div>

        <button 
          id="btn-mobile-chat-shortcut"
          onClick={() => setActiveTab("messages")}
          className="p-2 text-zinc-300 hover:text-white rounded-full hover:bg-white/5 transition"
        >
          <MessageCircle size={18} />
        </button>
      </header>

      {/* MAIN VIEWPORT CANVAS */}
      <main className="flex-1 overflow-y-auto min-h-0 relative flex flex-col justify-start pb-20 md:pb-0 bg-[#050505]">
        
        {/* Tab 1: Home Feed screen */}
        {activeTab === "feed" && (
          <div id="tab-feed-view" className="w-full max-w-xl mx-auto p-4 md:p-8 space-y-8">
            
            {/* Horizontal Stories bubble row matching top story bar */}
            <div className="bg-zinc-900/10 border border-white/5 p-5 rounded-3xl flex gap-6 overflow-x-auto no-scrollbar shadow-sm">
              {stories.map((story, idx) => (
                <button
                  id={`btn-story-bubble-${story.username}`}
                  key={story.id}
                  onClick={() => setActiveStoryIndex(idx)}
                  className="flex flex-col items-center gap-2 shrink-0 focus:outline-none group cursor-pointer"
                >
                  <div className={`p-0.5 rounded-full border-2 transition-transform duration-200 group-hover:scale-105 ${
                    story.hasViewed 
                      ? "border-white/10" 
                      : "border-amber-200/50"
                  }`}>
                    <img 
                      src={story.userAvatar} 
                      alt={story.username} 
                      className="w-14 h-14 rounded-full border border-white/10 object-cover bg-zinc-850"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-normal uppercase tracking-widest max-w-[65px] truncate">{story.username}</span>
                </button>
              ))}
            </div>

            {/* Posts Scroll listing */}
            <div className="space-y-8">
              {posts.map((post) => (
                <article 
                  id={`feed-post-${post.id}`}
                  key={post.id} 
                  className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
                >
                  {/* Post header user info row */}
                  <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs shrink-0 text-white">
                        {post.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-zinc-100">{post.username}</h3>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-bold text-amber-100/70 uppercase tracking-widest">
                      {post.category}
                    </div>
                  </div>

                  {/* Core Content image with Double-Tap like capabilities */}
                  <div 
                    id={`post-image-container-${post.id}`}
                    onDoubleClick={() => handleDoubleTap(post.id)}
                    className="relative w-full aspect-square bg-zinc-950 overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={post.imageUrl} 
                      alt="Post visual asset" 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Location Overlay Badge matching design template */}
                    {post.location && (
                      <div className="absolute bottom-6 left-6">
                        <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[9px] uppercase tracking-widest text-zinc-200">
                          {post.location}
                        </div>
                      </div>
                    )}

                    {/* Double-tap Floating heart overlay */}
                    {doubleTapPostId === post.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none z-10 animate-ping">
                        <div className="bg-black/40 p-6 rounded-full">
                          <Heart size={55} fill="white" className="text-white filter drop-shadow-md" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Buttons ribbon */}
                  <div className="px-6 pt-5 pb-2 flex justify-between items-center text-zinc-400">
                    <div className="flex items-center gap-5">
                      <button 
                        id={`btn-post-like-${post.id}`}
                        onClick={() => handleLikePost(post.id)}
                        className="hover:text-white transition duration-150 transform active:scale-90"
                      >
                        <Heart 
                          size={18} 
                          fill={post.hasLiked ? "#ef4444" : "none"} 
                          className={post.hasLiked ? "text-red-500 scale-110" : "text-zinc-400"} 
                        />
                      </button>
                      
                      <button 
                        id={`btn-post-comment-icon-${post.id}`}
                        onClick={() => setLightboxPost(post)}
                        className="hover:text-white transition"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>

                    <button 
                      id={`btn-post-bookmark-${post.id}`}
                      onClick={() => handleBookmarkPost(post.id)}
                      className="hover:text-white transition duration-150 transform active:scale-90"
                    >
                      <Bookmark 
                        size={18} 
                        fill={post.hasBookmarked ? "white" : "none"} 
                        className={post.hasBookmarked ? "text-white" : "text-zinc-400"} 
                      />
                    </button>
                  </div>

                  {/* Post details area */}
                  <div className="px-6 pb-6 pt-1 space-y-3">
                    
                    {/* Likes Count */}
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {post.likesCount + (post.hasLiked ? 1 : 0)} likes
                    </p>

                    {/* Author caption block */}
                    <div className="text-xs text-zinc-300 leading-relaxed font-normal">
                      <span className="font-bold mr-1.5 text-zinc-100 hover:underline cursor-pointer">{post.username}</span>
                      <span>{post.caption}</span>
                    </div>

                    {/* Comments preview block */}
                    {post.comments.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <button 
                          id={`btn-view-all-comments-${post.id}`}
                          onClick={() => setLightboxPost(post)}
                          className="text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold tracking-wider uppercase"
                        >
                          View all {post.comments.length} comments
                        </button>
                        
                        <div className="space-y-1">
                          {post.comments.slice(-2).map((comment, index) => (
                            <div key={index} className="text-xs text-zinc-300">
                              <span className="font-bold mr-1.5 text-zinc-200 hover:underline cursor-pointer">{comment.username}</span>
                              <span>{comment.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ask AI to Comment button ribbon */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-white/5">
                      <button
                        id={`btn-feed-ai-react-${post.id}`}
                        onClick={() => handleFeedPostAIComments(post.id, post.caption, post.category)}
                        disabled={isGeneratingCommentsMap[post.id]}
                        className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-[9px] uppercase font-bold tracking-widest px-4 py-2 rounded-full text-amber-100/80 transition flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles size={11} className={isGeneratingCommentsMap[post.id] ? "animate-spin text-amber-300" : "text-amber-200"} />
                        <span>{isGeneratingCommentsMap[post.id] ? "Curating comments..." : "Request AI Curation Comments"}</span>
                      </button>
                    </div>

                    <span className="text-[8px] text-zinc-500 block tracking-widest uppercase pt-1">
                      {post.timestamp}
                    </span>

                    {/* Inline comment inputs form */}
                    <form 
                      onSubmit={(e) => handleInlineCommentSubmit(e, post.id)}
                      className="flex gap-2 pt-3 border-t border-white/5"
                    >
                      <input 
                        id={`input-inline-comment-${post.id}`}
                        type="text" 
                        placeholder="Add dynamic comment..."
                        value={userCommentText[post.id] || ""}
                        onChange={(e) => setUserCommentText({
                          ...userCommentText,
                          [post.id]: e.target.value
                        })}
                        className="flex-1 bg-transparent border-none py-1 text-xs text-zinc-300 placeholder-zinc-650 outline-none focus:ring-0"
                      />
                      <button 
                        id={`btn-inline-comment-send-${post.id}`}
                        type="submit" 
                        disabled={!(userCommentText[post.id] || "").trim()}
                        className="text-white hover:text-amber-200 text-xs font-bold px-2 transition disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider"
                      >
                        Send
                      </button>
                    </form>

                  </div>
                </article>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Discover Explore grid */}
        {activeTab === "explore" && (
          <ExploreView 
            posts={posts} 
            onLikePost={handleLikePost}
            onBookmarkPost={handleBookmarkPost}
            onAddComment={handleAddComment}
            onUpdateComments={handleUpdateComments}
          />
        )}

        {/* Tab 3: Create Post panel */}
        {activeTab === "create" && (
          <div className="w-full h-full flex items-center justify-center p-4">
            <CreatePost onAddPost={handleAddPost} />
          </div>
        )}

        {/* Tab 4: Vertical Reels Stream */}
        {activeTab === "reels" && (
          <div className="w-full h-[85vh] md:h-screen flex items-center justify-center p-4">
            <ReelsView reels={reels} onLikeReel={handleLikeReel} />
          </div>
        )}

        {/* Tab 5: Direct messages chat layout */}
        {activeTab === "messages" && (
          <div className="w-full h-[80vh] md:h-screen p-4 md:p-6">
            <DirectMessages 
              conversations={conversations} 
              onSendMessage={handleSendMessage}
              onSetConversations={setConversations}
            />
          </div>
        )}

        {/* Tab 6: Personal Profile views */}
        {activeTab === "profile" && (
          <ProfileView 
            posts={posts} 
            onOpenDetail={(post) => setLightboxPost(post)} 
          />
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <footer className="md:hidden fixed bottom-0 inset-x-0 bg-zinc-950/95 backdrop-blur border-t border-zinc-900 flex justify-around py-3 z-30 px-2 shadow-lg">
        {[
          { id: "feed", icon: Home, title: "Home" },
          { id: "explore", icon: Search, title: "Search" },
          { id: "create", icon: PlusSquare, title: "Post" },
          { id: "reels", icon: Film, title: "Reels" },
          { id: "messages", icon: MessageCircle, title: "DMs" },
          { id: "profile", icon: User, title: "Me" }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`mobile-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex flex-col items-center gap-1 p-1 transition cursor-pointer ${
                isActive ? "text-white scale-110" : "text-zinc-500"
              }`}
            >
              <Icon size={18} />
              <span className="text-[8px] font-semibold">{tab.title}</span>
            </button>
          );
        })}
      </footer>

      {/* STORY PLAYER MODAL OVERLAY */}
      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={stories} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)}
          onStoryViewed={handleStoryViewed}
        />
      )}

      {/* LIGHTBOX DETAIL MODAL VIEW (Shared profile grid triggers) */}
      {lightboxPost && (
        <div id="app-lightbox-overlay" className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] shadow-2xl relative">
            <button
              id="btn-app-lightbox-close"
              onClick={() => setLightboxPost(null)}
              className="absolute top-4 right-4 z-40 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full border border-white/5 transition"
            >
              close
            </button>
            <div className="w-full md:w-[50%] bg-black flex items-center justify-center">
              <img src={lightboxPost.imageUrl} alt={lightboxPost.caption} className="max-h-[40vh] md:max-h-[85vh] object-contain w-full" />
            </div>
            <div className="w-full md:w-[50%] p-4 flex flex-col justify-between max-h-[45vh] md:max-h-none overflow-y-auto">
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                    {lightboxPost.username[0].toUpperCase()}
                  </div>
                  <h4 className="font-bold text-xs">{lightboxPost.username}</h4>
                </div>
                <p className="text-xs text-zinc-300 border-b border-zinc-900/60 pb-3">{lightboxPost.caption}</p>
                <div className="space-y-2">
                  {lightboxPost.comments.map((c) => (
                    <div key={c.id} className="text-xs">
                      <span className="font-bold mr-1.5">{c.username}</span>
                      <span className="text-zinc-300">{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
