"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  DEFAULT_CHAT_CATEGORY,
  getAvailableChatCategories,
  getChatCategory,
  isCategoryAvailable,
  type ChatCategoryId,
} from "@/lib/chat-categories";
import { useSubscription } from "@/contexts/subscription-context";
import { cn } from "@/lib/utils";

type ChatCategorySelectorProps = {
  value?: ChatCategoryId;
  onChange?: (id: ChatCategoryId) => void;
  /** Abre o menu para cima quando o seletor está no composer (estilo Claude) */
  menuPlacement?: "top" | "bottom";
};

export function ChatCategorySelector({
  value: controlledValue,
  onChange,
  menuPlacement = "top",
}: ChatCategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<ChatCategoryId>(DEFAULT_CHAT_CATEGORY);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPro } = useSubscription();

  const value = controlledValue ?? internalValue;
  const selected = getChatCategory(value);
  const categories = getAvailableChatCategories(isPro);

  const select = (id: ChatCategoryId) => {
    if (!controlledValue) setInternalValue(id);
    onChange?.(id);
    setOpen(false);
  };

  // Volta para um modelo gratuito caso o acesso Pro deixe de estar disponível.
  useEffect(() => {
    if (!isCategoryAvailable(value, isPro)) {
      if (!controlledValue) setInternalValue(DEFAULT_CHAT_CATEGORY);
      onChange?.(DEFAULT_CHAT_CATEGORY);
    }
  }, [value, isPro, controlledValue, onChange]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 border border-transparent",
          "hover:border-white/[0.08] hover:bg-white/[0.03] hover:text-gray-200 transition-all",
          open && "border-white/[0.08] bg-white/[0.03] text-gray-200"
        )}
      >
        <span>{selected.label}</span>
        {selected.tier === "pro" && (
          <span className="rounded bg-indigo-500/15 px-1 py-0.5 text-[9px] font-bold tracking-wider text-indigo-300 border border-indigo-500/25">
            PRO
          </span>
        )}
        <ChevronDown
          className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: menuPlacement === "top" ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: menuPlacement === "top" ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-label="Modelo de criação"
            className={cn(
              "absolute left-0 z-[60] w-[min(100vw-2rem,320px)] rounded-xl border border-white/[0.08] bg-[#0c0c0c]/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] py-1.5 overflow-hidden",
              menuPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {categories.map((category) => {
              const isSelected = category.id === value;
              const isProModel = category.tier === "pro";
              return (
                <button
                  key={category.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(category.id)}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-white/[0.03] last:border-b-0",
                    isSelected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]",
                    isProModel && "hover:bg-indigo-500/[0.06]"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white tracking-wide opacity-90">
                        {category.label}
                      </p>
                      {isProModel && (
                        <span className="rounded bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-indigo-300 border border-indigo-500/25">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden />
                  )}
                </button>
              );
            })}

            {!isPro && (
              <Link
                href="/dashboard/upgrade"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 border-t border-white/[0.06] bg-indigo-500/[0.04] hover:bg-indigo-500/[0.09] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">Desbloquear modelos PRO</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    Nano Banana PRO e Claude Design no plano Pro.
                  </p>
                </div>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
