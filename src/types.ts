export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  avatarColor?: string;
}

export interface Post {
  id: string;
  username: string;
  userAvatar: string; // url or color class
  avatarColor?: string;
  imageUrl: string;
  category: string;
  caption: string;
  location?: string;
  likesCount: number;
  hasLiked: boolean;
  hasBookmarked: boolean;
  comments: Comment[];
  timestamp: string;
}

export interface Story {
  id: string;
  username: string;
  userAvatar: string;
  avatarColor?: string;
  mediaUrl: string;
  type: "image" | "video";
  hasViewed: boolean;
}

export interface Reel {
  id: string;
  username: string;
  userAvatar: string;
  avatarColor?: string;
  videoUrl: string;
  caption: string;
  musicTrack: string;
  likesCount: number;
  commentsCount: number;
  hasLiked: boolean;
}

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface DMConversation {
  id: string;
  botId: string;
  botName: string;
  botAvatar: string;
  avatarColor: string;
  botPersona: string;
  lastMessage: string;
  lastTimestamp: string;
  messages: Message[];
  unread?: boolean;
}

export interface AICompanion {
  id: string;
  name: string;
  avatarColor: string;
  role: string;
  persona: string;
  greeting: string;
  tags: string[];
}

export type TabType = "feed" | "explore" | "create" | "reels" | "messages" | "profile";
