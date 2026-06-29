import React, { useState, useRef } from "react";
import { Sparkles, Image as ImageIcon, MapPin, Check, Plus, UploadCloud, ChevronDown, ChevronUp, RefreshCw, Sliders, FileText } from "lucide-react";
import { PRESET_POST_IMAGES } from "../data";

interface CreatePostProps {
  onAddPost: (postData: {
    imageUrl: string;
    caption: string;
    category: string;
    location: string;
  }) => void;
}

export default function CreatePost({ onAddPost }: CreatePostProps) {
  const [selectedCategory, setSelectedCategory] = useState("Minimal");
  const [imageUrl, setImageUrl] = useState(PRESET_POST_IMAGES[1].url); // default minimal modern chair
  const [customUrl, setCustomUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tone, setTone] = useState("aesthetic & moody");
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Advanced Caption Generator states
  const [showAdvancedAi, setShowAdvancedAi] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [advTone, setAdvTone] = useState("aesthetic & moody");
  const [advLength, setAdvLength] = useState("short & punchy");
  const [advCta, setAdvCta] = useState("None");
  const [advPostType, setAdvPostType] = useState("Feed Post");
  const [isAdvGenerating, setIsAdvGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[] | null>(null);

  // File Upload states (with base64 content tracker for multimodal analysis)
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Minimal", "Travel", "Cyberpunk", "Gourmet", "Art & Life"];

  // Handle Drag and Drop Files
  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64Str = e.target.result as string;
          setImageUrl(base64Str);
          setUploadedBase64(base64Str);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  // Handle Preset Image switch based on category change
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    // Find preset image matching category
    const found = PRESET_POST_IMAGES.find((p) => p.category.toLowerCase().includes(cat.toLowerCase().slice(0, 4)));
    if (found) {
      setImageUrl(found.url);
      setUploadedBase64(null); // clear uploaded file if switching to presets
      setCustomUrl("");
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setImageUrl(customUrl.trim());
      setUploadedBase64(null); // clear uploaded file
    }
  };

  // Generate Simple Caption via Gemini API
  const handleGenerateCaption = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: caption,
          theme: selectedCategory,
          tone: tone
        })
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      if (data.caption) {
        setCaption(data.caption);
      }
    } catch (err) {
      console.error("Caption generation error:", err);
      // Nice backup default
      setCaption(`Quietly observing the world through a ${selectedCategory.toLowerCase()} lens. ✨🍂 Let simplicity take center stage today. #AestheticMindset #${selectedCategory}Vibes`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Suite of 3 Advanced Captions
  const handleGenerateAdvancedCaptions = async () => {
    setIsAdvGenerating(true);
    setAiSuggestions(null);
    try {
      const response = await fetch("/api/gemini/advanced-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords,
          tone: advTone,
          length: advLength,
          cta: advCta,
          postType: advPostType,
          theme: selectedCategory,
          image: uploadedBase64, // base64 payload
          imageUrl: uploadedBase64 ? null : imageUrl // image URL payload
        })
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      if (data.options) {
        setAiSuggestions(data.options);
      }
    } catch (err) {
      console.error("Advanced caption suite generation error:", err);
    } finally {
      setIsAdvGenerating(false);
    }
  };

  const handleSubmitPost = () => {
    if (!imageUrl) return;

    onAddPost({
      imageUrl,
      caption: caption || "No caption provided.",
      category: selectedCategory,
      location: location || "Cosmos"
    });

    setSuccessMsg("Post created successfully! Check home feed. ✨");
    setCaption("");
    setLocation("");
    setCustomUrl("");
    setKeywords("");
    setUploadedBase64(null);
    setAiSuggestions(null);

    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  return (
    <div id="create-post-root" className="w-full max-w-xl mx-auto bg-zinc-900/40 border border-white/5 rounded-3xl p-6 select-none text-zinc-100 shadow-2xl">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-amber-200">
          <Plus size={14} />
        </div>
        <h2 className="font-semibold text-sm tracking-widest text-zinc-100 uppercase">transmission / draft</h2>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs py-3 px-4 rounded-xl mb-5 flex items-center gap-2 font-medium">
          <Check size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left column: Visuals selection */}
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
            1. CHOOSE POST VISUAL
          </label>
          
          {/* Active Preview */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 shadow-inner">
            <img 
              src={imageUrl} 
              alt="Post asset preview" 
              className="w-full h-full object-cover transition duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80";
              }}
            />
            <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm border border-white/10 text-[9px] text-zinc-350 font-bold tracking-widest px-2.5 py-1 rounded-full">
              {selectedCategory.toUpperCase()}
            </div>
            {uploadedBase64 && (
              <div className="absolute top-2.5 right-2.5 bg-amber-500/80 backdrop-blur-sm text-[9px] text-black font-extrabold tracking-widest px-2.5 py-1 rounded-full uppercase">
                Uploaded
              </div>
            )}
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition cursor-pointer text-center ${
              isDragging 
                ? "border-amber-200 bg-amber-200/5 text-amber-200" 
                : "border-white/10 hover:border-white/25 bg-white/5 text-zinc-400 hover:text-zinc-300"
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }} 
              accept="image/*" 
              className="hidden" 
            />
            <UploadCloud size={18} className="mb-1.5 text-zinc-400" />
            <span className="text-[10px] uppercase tracking-widest font-extrabold">Drag & Drop Image</span>
            <span className="text-[8px] text-zinc-550 uppercase tracking-widest mt-0.5">Or click to browse storage</span>
          </div>

          {/* Curated Presets switcher */}
          <div className="space-y-2">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">PRESET SUGGESTIONS</span>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_POST_IMAGES.map((preset) => (
                <button
                  id={`btn-preset-img-${preset.label.replace(/\s+/g, '-')}`}
                  key={preset.label}
                  onClick={() => {
                    setImageUrl(preset.url);
                    setSelectedCategory(preset.category);
                    setUploadedBase64(null); // Clear upload when preset selected
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border transition cursor-pointer ${
                    (imageUrl === preset.url && !uploadedBase64) ? "border-amber-200 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL Field inputs */}
          <form onSubmit={handleCustomUrlSubmit} className="space-y-1.5 pt-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">OR PASTE CUSTOM URL</span>
            <div className="flex gap-2">
              <input
                id="input-custom-url"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-white/20 transition"
              />
              <button
                id="btn-apply-custom-url"
                type="submit"
                className="bg-white/5 hover:bg-white/10 text-[10px] font-bold tracking-widest px-4 py-2 rounded-xl border border-white/10 transition cursor-pointer text-zinc-300 uppercase"
              >
                Apply
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Form values and Gemini Generator */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Category chooser list */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2">
                2. THEME CATEGORY
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    id={`btn-cat-${cat.replace(/\s+/g, '-')}`}
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-[10px] font-semibold py-1.5 px-3 rounded-full border transition cursor-pointer ${
                      selectedCategory === cat 
                        ? "bg-white text-black border-white" 
                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Caption box */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                  3. CAPTION CONTENT
                </label>
                
                {/* Tone select dropdown */}
                <select 
                  id="select-caption-tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="bg-transparent border-none text-[9px] text-zinc-500 font-bold uppercase tracking-widest cursor-pointer outline-none focus:ring-0 pr-0"
                >
                  <option value="aesthetic & moody" className="bg-[#050505] text-zinc-350">Moody Aesthetic</option>
                  <option value="witty & trendy" className="bg-[#050505] text-zinc-350">Witty Trend</option>
                  <option value="poetic & quiet" className="bg-[#050505] text-zinc-350">Poetic</option>
                  <option value="hype & energetic" className="bg-[#050505] text-zinc-350">Energetic Hype</option>
                </select>
              </div>

              <div className="relative">
                <textarea
                  id="textarea-post-caption"
                  rows={3}
                  placeholder="Share the story behind this frame..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-3 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-white/20 transition resize-none pr-10"
                />

                {/* Dynamic Gemini Spark Trigger button */}
                <button
                  id="btn-ai-assist-caption"
                  type="button"
                  onClick={handleGenerateCaption}
                  disabled={isGenerating}
                  className="absolute bottom-3 right-3 bg-white/5 border border-white/10 hover:bg-white/10 text-amber-200 hover:text-white p-2 rounded-full cursor-pointer transition disabled:opacity-40"
                  title="Quick Gemini Suggestion"
                >
                  <Sparkles size={12} className={isGenerating ? "animate-spin text-amber-300" : ""} />
                </button>
              </div>

              {isGenerating && (
                <p className="text-[10px] text-amber-200/80 mt-1.5 flex items-center gap-1.5 animate-pulse font-medium">
                  <Sparkles size={10} className="animate-spin text-amber-300" />
                  <span>Gemini is tailoring quick copywriting suggestions...</span>
                </p>
              )}
            </div>

            {/* Premium AI Copywriter Studio Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
              <button
                type="button"
                onClick={() => setShowAdvancedAi(!showAdvancedAi)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-amber-200 uppercase">
                  <Sparkles size={13} className="animate-pulse" />
                  <span>AI Copywriter Studio (Deep Curation)</span>
                </span>
                {showAdvancedAi ? (
                  <ChevronUp size={14} className="text-zinc-400" />
                ) : (
                  <ChevronDown size={14} className="text-zinc-400" />
                )}
              </button>

              {showAdvancedAi && (
                <div className="space-y-3.5 pt-2 border-t border-white/5 text-zinc-300">
                  
                  {/* Context keywords */}
                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-zinc-500 uppercase mb-1">
                      Post Context / Subject Keywords
                    </label>
                    <input
                      id="input-ai-keywords"
                      type="text"
                      placeholder="e.g. cozy rainy sunday morning, warm brew coffee, vinyl record"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-white/20 transition"
                    />
                  </div>

                  {/* Multi-parameter options selectors */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[8px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Target Tone</label>
                      <select
                        id="select-adv-tone"
                        value={advTone}
                        onChange={(e) => setAdvTone(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2 py-1.5 text-[10px] text-zinc-200 focus:border-white/20 outline-none"
                      >
                        <option value="aesthetic & moody">Moody Aesthetic</option>
                        <option value="humorous">Humorous & Witty</option>
                        <option value="inspirational">Inspirational</option>
                        <option value="professional">Professional / Brand</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Target Length</label>
                      <select
                        id="select-adv-length"
                        value={advLength}
                        onChange={(e) => setAdvLength(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2 py-1.5 text-[10px] text-zinc-200 focus:border-white/20 outline-none"
                      >
                        <option value="short & punchy">Short & Punchy</option>
                        <option value="detailed stories">Detailed Story</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Call-To-Action (CTA)</label>
                      <select
                        id="select-adv-cta"
                        value={advCta}
                        onChange={(e) => setAdvCta(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2 py-1.5 text-[10px] text-zinc-200 focus:border-white/20 outline-none"
                      >
                        <option value="None">None</option>
                        <option value="Ask a Question">Ask a Question</option>
                        <option value="Link in Bio">Link in Bio</option>
                        <option value="Share & Save">Share & Save</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Instagram Type</label>
                      <select
                        id="select-adv-post-type"
                        value={advPostType}
                        onChange={(e) => setAdvPostType(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2 py-1.5 text-[10px] text-zinc-200 focus:border-white/20 outline-none"
                      >
                        <option value="Feed Post">Feed Grid Post</option>
                        <option value="Cinematic Reel">Reel Video Text</option>
                        <option value="Daily Story">Daily Story Segment</option>
                      </select>
                    </div>
                  </div>

                  {/* Aesthetic analysis confirmation */}
                  <div className="text-[9px] text-zinc-500 flex items-center gap-1.5 italic">
                    <Check size={11} className="text-amber-200" />
                    <span>Gemini actively interprets colors & layout of chosen visual.</span>
                  </div>

                  {/* Primary Trigger */}
                  <button
                    id="btn-trigger-advanced-ai"
                    type="button"
                    onClick={handleGenerateAdvancedCaptions}
                    disabled={isAdvGenerating}
                    className="w-full bg-amber-200 hover:bg-amber-300 text-black text-[10px] uppercase tracking-widest font-extrabold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    {isAdvGenerating ? (
                      <>
                        <RefreshCw size={12} className="animate-spin text-black" />
                        <span>Curating Suite (Gemini AI)...</span>
                      </>
                    ) : (
                      <>
                        <Sliders size={12} className="text-black" />
                        <span>Generate Caption Suite</span>
                      </>
                    )}
                  </button>

                  {/* AI Output Options Stream */}
                  {aiSuggestions && (
                    <div className="space-y-3 pt-3 border-t border-white/10 animate-fadeIn">
                      <span className="block text-[8px] font-bold tracking-widest text-zinc-400 uppercase">
                        Recommended Creative Variations
                      </span>
                      {aiSuggestions.map((opt) => (
                        <div 
                          key={opt.id} 
                          className="bg-zinc-950 border border-white/5 p-3 rounded-xl space-y-2 hover:border-amber-200/20 transition relative group"
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[7.5px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-amber-200 font-extrabold uppercase tracking-widest">
                              {opt.tone} • {opt.postType}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const formattedHashtags = opt.hashtags
                                  ? opt.hashtags.map((h: string) => h.startsWith("#") ? h : `#${h}`).join(" ")
                                  : "";
                                setCaption(`${opt.text}\n\n${formattedHashtags}`);
                              }}
                              className="text-[8px] bg-white text-black px-2 py-1 rounded-lg font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-200 transition"
                            >
                              Apply
                            </button>
                          </div>
                          
                          <p className="text-[11px] text-zinc-200 leading-relaxed font-normal">
                            {opt.text}
                          </p>
                          
                          {opt.hashtags && opt.hashtags.length > 0 && (
                            <p className="text-[9px] text-amber-200/65 font-mono tracking-wide leading-none">
                              {opt.hashtags.map((h: string) => h.startsWith("#") ? h : `#${h}`).join(" ")}
                            </p>
                          )}

                          {opt.explanation && (
                            <p className="text-[8px] text-zinc-500 font-medium tracking-wide uppercase mt-1">
                              💡 {opt.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Location tagger input */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2">
                4. ADD LOCATION
              </label>
              <div className="flex items-center bg-zinc-950 border border-white/10 rounded-2xl px-3 py-1.5">
                <MapPin size={12} className="text-zinc-600 mr-2 shrink-0" />
                <input
                  id="input-post-location"
                  type="text"
                  placeholder="E.g., Kyoto, Japan or Oslo, Norway"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:ring-0 py-1.5"
                />
              </div>
            </div>

          </div>

          {/* Submit/Publish actions */}
          <div className="pt-4 border-t border-white/5">
            <button
              id="btn-publish-post"
              type="button"
              onClick={handleSubmitPost}
              className="w-full bg-white text-black font-extrabold text-xs py-3.5 rounded-2xl hover:bg-neutral-200 transition duration-150 transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md uppercase tracking-widest"
            >
              Publish Post to Feed
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
