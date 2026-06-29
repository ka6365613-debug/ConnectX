import { Post, Story, Reel, AICompanion } from "./types";

export const MOCK_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80"
];

export const INITIAL_AI_COMPANIONS: AICompanion[] = [
  {
    id: "gigi",
    name: "Gigi",
    avatarColor: "from-pink-500 to-rose-400",
    role: "Aesthetic & Style Advisor",
    persona: "a chic, witty Parisian fashion designer obsessed with minimal layout, archival fashion, and vintage accessories. She is bubbly, speaks with elegant taste, and uses chic emojis.",
    greeting: "Bonjour darling! ✨ I've been curating today's lookbooks. What aesthetic masterpiece are we building together today?",
    tags: ["Fashion", "Minimalist", "Creative Direction"]
  },
  {
    id: "aris",
    name: "Aris",
    avatarColor: "from-blue-500 to-cyan-400",
    role: "Travel Photographer",
    persona: "a rugged, thoughtful travel photographer who captures the world on film. He is serene, deeply appreciative of quiet natural beauty, and gives incredible composition or location advice.",
    greeting: "Hey there! Just finished developing some film from my trip to the Swiss Alps. 🏔️ Where are you dreaming of traveling to next?",
    tags: ["Photography", "Travel", "Adventure"]
  },
  {
    id: "zack",
    name: "Zack",
    avatarColor: "from-orange-500 to-amber-400",
    role: "Fitness & Mindset Coach",
    persona: "a highly motivating, supportive, high-energy trainer who believes in balance, dynamic movement, and mental resilience. He uses lots of high-energy words and loves checking in on daily goals.",
    greeting: "Let's go! 🔥 Another day to step up, get active, and clear the mind. How did you challenge yourself today?",
    tags: ["Fitness", "Mindset", "Daily Streak"]
  },
  {
    id: "luna",
    name: "Luna",
    avatarColor: "from-purple-500 to-indigo-400",
    role: "Mystic Astrologer",
    persona: "a calm, esoteric cosmic guide who interprets current alignments, planetary retrogrades, and intuitive crystals. She uses spiritual/mystic wording and loves discussing cards and signs.",
    greeting: "Greetings, celestial traveler. 🌌 The stars have a gentle alignment tonight, perfect for reflection. What questions are you carrying in your heart?",
    tags: ["Astrology", "Mystic", "Intuition"]
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: "story_1",
    username: "gigi_style",
    userAvatar: MOCK_AVATARS[0],
    avatarColor: "bg-pink-500",
    mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    type: "image",
    hasViewed: false
  },
  {
    id: "story_2",
    username: "aris_lens",
    userAvatar: MOCK_AVATARS[1],
    avatarColor: "bg-blue-500",
    mediaUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    type: "image",
    hasViewed: false
  },
  {
    id: "story_3",
    username: "coffee_notes",
    userAvatar: MOCK_AVATARS[2],
    avatarColor: "bg-yellow-500",
    mediaUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80",
    type: "image",
    hasViewed: false
  },
  {
    id: "story_4",
    username: "cyber_neon",
    userAvatar: MOCK_AVATARS[3],
    avatarColor: "bg-purple-500",
    mediaUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    type: "image",
    hasViewed: false
  },
  {
    id: "story_5",
    username: "minimal_space",
    userAvatar: MOCK_AVATARS[4],
    avatarColor: "bg-green-500",
    mediaUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    type: "image",
    hasViewed: false
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "post_1",
    username: "aris_lens",
    userAvatar: MOCK_AVATARS[1],
    avatarColor: "bg-blue-500",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    category: "Travel",
    caption: "Waking up to mountain mist and absolute quiet. 🌲🏔️ Deep breath in, letting the stillness fuel the soul before a day of trekking. #Wanderlust #QuietNature #SwissAlps",
    location: "Zermatt, Switzerland",
    likesCount: 1420,
    hasLiked: false,
    hasBookmarked: false,
    timestamp: "2 hours ago",
    comments: [
      { id: "c1_1", username: "gigi_style", text: "Stunning! The color palette of that morning fog is to die for. 🤍🏔️", timestamp: "1h ago" },
      { id: "c1_2", username: "luna_mystic", text: "The earth energy here is so grounding. Beautiful framing! ✨🌌", timestamp: "45m ago" }
    ]
  },
  {
    id: "post_2",
    username: "gigi_style",
    userAvatar: MOCK_AVATARS[0],
    avatarColor: "bg-pink-500",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    category: "Fashion",
    caption: "Autumn coat silhouettes and vintage silver chains. Simplicity always speaks the loudest. 🧥🍂 Finding comfort in archival textures today. #AestheticStyle #MinimalFashion #ClassicLook",
    location: "Le Marais, Paris",
    likesCount: 934,
    hasLiked: false,
    hasBookmarked: false,
    timestamp: "5 hours ago",
    comments: [
      { id: "c2_1", username: "coffee_notes", text: "Where did you source that coat? The drape is phenomenal! 😍", timestamp: "3h ago" },
      { id: "c2_2", username: "aris_lens", text: "Terrific clean lighting, matches the minimal feel perfectly.", timestamp: "2h ago" }
    ]
  },
  {
    id: "post_3",
    username: "cyber_neon",
    userAvatar: MOCK_AVATARS[3],
    avatarColor: "bg-purple-500",
    imageUrl: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80",
    category: "Cyberpunk",
    caption: "Drenched in neon. 🌧️🔮 The rain-soaked streets of Shibuya turn into an absolute visual playground at midnight. Reflective dreams. #Cyberpunk #ShinjukuMidnight #StreetPhotography #NeonNoir",
    location: "Tokyo, Japan",
    likesCount: 2310,
    hasLiked: false,
    hasBookmarked: false,
    timestamp: "1 day ago",
    comments: [
      { id: "c3_1", username: "aris_lens", text: "Insane reflection work here. Long exposure or raw speed? ⚡🔥", timestamp: "18h ago" },
      { id: "c3_2", username: "gigi_style", text: "The violet-cyan styling is incredibly striking. Gorgeous futuristic mood.", timestamp: "12h ago" }
    ]
  },
  {
    id: "post_4",
    username: "gourmet_joys",
    userAvatar: MOCK_AVATARS[2],
    avatarColor: "bg-yellow-500",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
    category: "Gourmet",
    caption: "Homemade sourdough pizza with fresh buffalo mozzarella, heirloom cherry tomatoes, and hand-picked sweet basil. 🍕🌱 Cooked with fire and love. #HomemadePizza #SourdoughClub #GourmetFood",
    location: "Naples, Italy",
    likesCount: 812,
    hasLiked: false,
    hasBookmarked: false,
    timestamp: "2 days ago",
    comments: [
      { id: "c4_1", username: "fitness_zack", text: "That crust is clean fuel right there! Looks incredibly delicious! 😋🍽️", timestamp: "1d ago" },
      { id: "c4_2", username: "minimal_space", text: "Minimal ingredients, maximal flavor. Elegant plating.", timestamp: "18h ago" }
    ]
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: "reel_1",
    username: "travel_adventurer",
    userAvatar: MOCK_AVATARS[1],
    avatarColor: "bg-blue-500",
    // Premium free vertical loops from Pexels/Pixabay
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-waterfall-in-forest-2255-large.mp4",
    caption: "Lost in the hidden waterfalls of Bali. 🌴💦 Absolutely untouched paradise. Would you stay here?",
    musicTrack: "Island Chillout - Ambient Beats",
    likesCount: 4520,
    commentsCount: 189,
    hasLiked: false
  },
  {
    id: "reel_2",
    username: "cyber_commute",
    userAvatar: MOCK_AVATARS[3],
    avatarColor: "bg-purple-500",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-tokyo-street-at-night-42284-large.mp4",
    caption: "Midnight trains and electric rain. 🌌⚡ The pure vibe of futuristic Tokyo transit. #Cyberpunk #Rain",
    musicTrack: "Shibuya Synthwave - NeoTokyo",
    likesCount: 9284,
    commentsCount: 542,
    hasLiked: false
  },
  {
    id: "reel_3",
    username: "gigi_fashion",
    userAvatar: MOCK_AVATARS[0],
    avatarColor: "bg-pink-500",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-posing-with-a-beige-trench-coat-40742-large.mp4",
    caption: "Unboxing my new favorite minimal accessories for the fall season. 👜✨ Simplicity speaks.",
    musicTrack: "Parisian Café Jazz - LoFi Chic",
    likesCount: 3125,
    commentsCount: 104,
    hasLiked: false
  }
];

export const PRESET_POST_IMAGES = [
  {
    category: "Travel",
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    label: "Alpine Lake Boat"
  },
  {
    category: "Minimal",
    url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    label: "Cozy Modern Chair"
  },
  {
    category: "Cyberpunk",
    url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
    label: "Neon Storefront"
  },
  {
    category: "Gourmet",
    url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    label: "Fresh Salad Plate"
  },
  {
    category: "Art & Life",
    url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    label: "Splashes of Paint"
  }
];
