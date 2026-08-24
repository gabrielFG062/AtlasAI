"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Plus, Mic, Send, Sparkles } from "lucide-react";
import { ChatCategorySelector } from "@/components/chat/chat-category-selector";
import type { ChatCategoryId } from "@/lib/chat-categories";
import { cn } from "@/lib/utils";

type ChatComposerProps = {
  category: ChatCategoryId;
  onCategoryChange: (id: ChatCategoryId) => void;
  onSendMessage?: (text: string) => void;
};

export function ChatComposer({
  category,
  onCategoryChange,
  onSendMessage,
}: ChatComposerProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage?.(text);
    setText("");
    // Keep focus on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/5 focus-within:border-indigo-500/30 focus-within:shadow-[0_0_35px_rgba(99,102,241,0.15)] focus-within:ring-indigo-500/10 transition-all duration-300">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre seus dados... (ex: Por que minhas vendas caíram?)"
            className="w-full bg-transparent border-none text-white placeholder:text-gray-500/80 focus:outline-none text-[15px] leading-relaxed font-sans"
          />
        </div>
        {text.trim() && (
          <span className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/[0.08] bg-white/[0.03] px-1.5 font-mono text-[10px] font-medium text-gray-500">
            <span>Enter</span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-3.5 pb-3 pt-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] active:scale-95 transition-all duration-200"
            title="Anexar arquivos"
          >
            <Plus className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] active:scale-95 transition-all duration-200"
            title="Entrada por voz"
          >
            <Mic className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="h-4 w-[1px] bg-white/[0.08] mx-1" />
          <ChatCategorySelector
            value={category}
            onChange={onCategoryChange}
            menuPlacement="top"
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 shrink-0",
            text.trim()
              ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.35)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95"
              : "bg-white/[0.02] border border-white/[0.05] text-gray-600 cursor-not-allowed"
          )}
          title="Enviar mensagem"
        >
          <Send className="w-4 h-4 ml-0.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
