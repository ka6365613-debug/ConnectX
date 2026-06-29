import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, MessageSquare, AlertCircle, ArrowLeft } from "lucide-react";
import { DMConversation, Message, AICompanion } from "../types";
import { INITIAL_AI_COMPANIONS } from "../data";

interface DirectMessagesProps {
  conversations: DMConversation[];
  onSendMessage: (botId: string, text: string, sender: "user" | "bot") => void;
  onSetConversations: (convs: DMConversation[]) => void;
}

export default function DirectMessages({ conversations, onSendMessage, onSetConversations }: DirectMessagesProps) {
  const [selectedBotId, setSelectedBotId] = useState<string>("gigi");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mobileShowSidebar, setMobileShowSidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentConversation = conversations.find((c) => c.botId === selectedBotId) || conversations[0];
  const activeBot = INITIAL_AI_COMPANIONS.find((b) => b.id === selectedBotId) || INITIAL_AI_COMPANIONS[0];

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectConversation = (botId: string) => {
    setSelectedBotId(botId);
    setMobileShowSidebar(false); // Mobile drill-down
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    setInputText("");

    // 1. Post user message immediately to client state
    onSendMessage(selectedBotId, userText, "user");
    setIsTyping(true);

    try {
      // 2. Fetch response from full-stack Gemini endpoint
      // We pass the active message list (including the one we just posted)
      const updatedMessages: Message[] = [
        ...(currentConversation?.messages || []),
        { id: Date.now().toString(), sender: "user", text: userText, timestamp: "Just now" }
      ];

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          botName: activeBot.name,
          botPersona: activeBot.persona
        })
      });

      if (!response.ok) {
        throw new Error("Server response was not ok");
      }

      const data = await response.json();
      
      // 3. Post bot reply to state
      onSendMessage(selectedBotId, data.text || "I appreciate your thoughts!", "bot");
    } catch (err) {
      console.error("Failed to fetch DM response:", err);
      // Fail gracefully: generate friendly alternative response
      setTimeout(() => {
        onSendMessage(
          selectedBotId, 
          `Excuse me celestial friend, I hit a speedbump in the cosmos! 🌌 Could you repeat that?`, 
          "bot"
        );
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="dm-root" className="w-full h-full flex bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden select-none shadow-2xl">
      
      {/* 1. Left hand Conversations sidebar */}
      <div className={`w-full md:w-80 border-r border-white/5 bg-zinc-950 flex flex-col shrink-0 ${!mobileShowSidebar ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-white/5 flex items-center gap-2.5 bg-zinc-950">
          <MessageSquare size={16} className="text-zinc-400" />
          <h2 className="font-bold text-xs uppercase tracking-widest text-zinc-300">AI Direct Companions</h2>
        </div>

        {/* Sidebar list items */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 no-scrollbar">
          {conversations.map((conv) => {
            const isSelected = conv.botId === selectedBotId;
            return (
              <button
                id={`btn-select-conv-${conv.botId}`}
                key={conv.id}
                onClick={() => handleSelectConversation(conv.botId)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition border cursor-pointer ${
                  isSelected 
                    ? "bg-white/5 border-white/10" 
                    : "hover:bg-white/5 border-transparent"
                }`}
              >
                {/* Avatar with customized gradient */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${conv.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {conv.botName[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-zinc-100 text-xs truncate">{conv.botName}</h3>
                    <span className="text-[9px] text-zinc-500">{conv.lastTimestamp}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">{conv.lastMessage}</p>
                </div>

                {conv.unread && (
                  <div className="w-2 h-2 rounded-full bg-amber-300 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Chat Panel viewport */}
      <div className={`flex-1 flex flex-col bg-zinc-900/10 ${mobileShowSidebar ? "hidden md:flex" : "flex"}`}>
        
        {/* Chat header area */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            {/* Back button for mobile viewports */}
            <button 
              id="btn-dm-back"
              onClick={() => setMobileShowSidebar(true)}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 md:hidden transition cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>

            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${currentConversation?.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow`}>
              {currentConversation?.botName[0]}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-zinc-100 text-xs leading-none">{currentConversation?.botName}</h2>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
              </div>
              <p className="text-[9px] text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">{activeBot.role}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 flex items-center gap-1">
            <Sparkles size={10} className="text-amber-200" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">Gemini Active</span>
          </div>
        </div>

        {/* Messaging Stream scroll list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          
          {/* Persona Prompt Helper card info */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center max-w-sm mx-auto mb-4">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest mb-1">Meet {activeBot.name}</h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-normal">
              {activeBot.name} is {activeBot.persona}
            </p>
            <div className="flex justify-center gap-1.5 mt-2.5">
              {activeBot.tags.map((tag) => (
                <span key={tag} className="text-[8px] bg-white/5 border border-white/10 text-zinc-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {currentConversation?.messages.map((message) => {
            const isUser = message.sender === "user";
            return (
              <div 
                key={message.id} 
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-sm ${
                  isUser 
                    ? "bg-zinc-100 text-black rounded-br-none font-medium" 
                    : "bg-white/5 border border-white/10 text-zinc-100 rounded-bl-none leading-relaxed font-normal"
                }`}>
                  <p>{message.text}</p>
                  <span className={`text-[8px] block mt-1.5 text-right font-medium ${
                    isUser ? "text-zinc-500" : "text-zinc-550"
                  }`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator dots */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-3 px-4 flex items-center gap-1.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-[10px] font-bold text-zinc-500 ml-1.5 italic uppercase tracking-wider">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input box Form submission */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-zinc-950 flex gap-2">
          <input
            id="input-dm-message"
            type="text"
            placeholder={`Message ${currentConversation?.botName || "companion"}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-zinc-950 border border-white/10 rounded-full py-2.5 px-4 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-white/20 transition"
          />
          <button
            id="btn-send-dm"
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-white hover:bg-zinc-200 active:scale-95 text-zinc-950 p-2.5 rounded-full transition flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
          >
            <Send size={14} />
          </button>
        </form>

      </div>
    </div>
  );
}
