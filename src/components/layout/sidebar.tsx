"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  MoreHorizontal,
  MessageSquare,
  Share2,
  Trash2,
  FolderOpen,
  Plug,
  X,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChats } from "@/contexts/chats-context";
import { getChatShareUrl, type Chat } from "@/lib/chats";
import { useSubscription } from "@/contexts/subscription-context";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/icons/brand-logo";

function ChatListItem({
  chat,
  isActive,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onDelete,
  onShare,
}: {
  chat: Chat;
  isActive: boolean;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onDelete: () => void;
  onShare: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, onCloseMenu]);

  return (
    <div ref={menuRef} className="group relative">
      <Link
        href={`/dashboard/chat/${chat.id}`}
        className={cn(
          "w-full text-left text-sm rounded-lg pl-3 pr-9 py-2 transition-all duration-200 flex items-center border border-transparent font-medium",
          isActive
            ? "bg-white/[0.06] text-white border-white/[0.08]"
            : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
        )}
      >
        <MessageSquare className="w-4 h-4 mr-2.5 shrink-0 opacity-60" strokeWidth={1.5} />
        <span className="truncate">{chat.title}</span>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleMenu();
        }}
        className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all",
          isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        title="Opções da conversa"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            className="absolute right-0 top-full mt-1 z-50 min-w-[160px] py-1.5 rounded-xl border border-white/[0.08] bg-[#0c0c0c]/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onShare();
                onCloseMenu();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <Share2 className="w-4 h-4 shrink-0 text-gray-500" strokeWidth={1.5} />
              Compartilhar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onDelete();
                onCloseMenu();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 shrink-0 text-red-500" strokeWidth={1.5} />
              Apagar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  href?: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full transition-all duration-200",
          isActive ? "bg-indigo-500 opacity-100" : "bg-indigo-500 opacity-0"
        )}
      />
      <Icon className="w-4.5 h-4.5 mr-3 shrink-0 opacity-70" strokeWidth={1.5} />
      <span className="truncate">{label}</span>
    </>
  );

  const className = cn(
    "relative w-full justify-start px-3 h-9.5 transition-all duration-200 flex items-center text-sm rounded-lg border border-transparent font-medium",
    isActive
      ? "bg-white/[0.06] text-white border-white/[0.08]"
      : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={className}>
      {content}
    </Link>
  );
}

function isSidebarChatArea(pathname: string) {
  return (
    !pathname.startsWith("/dashboard/settings") &&
    !pathname.startsWith("/dashboard/upgrade") &&
    !pathname.startsWith("/workspace") &&
    !pathname.startsWith("/integracoes")
  );
}

function sortChatsByBusinessRules(chats: Chat[], query: string, activeChatId: string | null): Chat[] {
  const lowerQuery = query.trim().toLowerCase();

  const score = (chat: Chat): number => {
    let score = 0;
    const title = chat.title.toLowerCase();
    const now = Date.now();
    const ageHours = (now - chat.createdAt) / (1000 * 60 * 60);

    if (lowerQuery) {
      if (title === lowerQuery) score += 1000;
      else if (title.startsWith(lowerQuery)) score += 500;
      else if (title.includes(lowerQuery)) score += 250;
      else score -= 1000;
    }

    if (activeChatId === chat.id) score += 300;
    if (chat.title.toLowerCase().startsWith("nova conversa")) score -= 50;
    if (ageHours < 1) score += 200;
    else if (ageHours < 24) score += 100;
    else if (ageHours < 168) score += 50;
    else score -= ageHours * 0.5;

    return score;
  };

  return [...chats].sort((a, b) => score(b) - score(a));
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { chats, createNewChat, deleteChat } = useChats();
  const { isPro } = useSubscription();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const showChatSections = isSidebarChatArea(pathname);
  const activeChatId = pathname.startsWith("/dashboard/chat/")
    ? pathname.split("/dashboard/chat/")[1]?.split("/")[0]
    : null;

  const filteredChats = useMemo(() => {
    const sorted = sortChatsByBusinessRules(chats, searchQuery, activeChatId);
    if (!searchQuery.trim()) return sorted.slice(0, 20);
    return sorted.slice(0, 10);
  }, [chats, searchQuery, activeChatId]);

  const handleNewChat = () => {
    const chat = createNewChat();
    router.push(`/dashboard/chat/${chat.id}`);
  };

  const handleShare = async (chat: Chat) => {
    const url = getChatShareUrl(chat.id);
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(chat.id);
      setTimeout(() => setShareFeedback(null), 2000);
    } catch {
      setShareFeedback("error");
      setTimeout(() => setShareFeedback(null), 2000);
    }
  };

  const handleDelete = (id: string) => {
    deleteChat(id);
    if (openMenuId === id) setOpenMenuId(null);
    if (activeChatId === id) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen bg-[#050505]/95 backdrop-blur-xl border-r border-white/[0.06] flex flex-col overflow-hidden shrink-0 font-sans"
          >
            {/* Header / Brand */}
            <div className="p-4 flex items-center justify-between border-b border-white/[0.04]">
              <Link href="/dashboard" className="flex items-center min-w-0 group">
                <BrandLogo className="h-12 w-12 shrink-0 group-hover:opacity-90 transition-opacity" />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]"
                title="Fechar barra lateral"
              >
                <PanelLeftClose className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation Body */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
              <div className="space-y-1">
                <Button
                  type="button"
                  onClick={handleNewChat}
                  className="w-full justify-between items-center text-white bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all px-3 h-10 rounded-xl font-medium shadow-sm active:scale-[0.98] mb-3"
                >
                  <span className="flex items-center">
                    <Plus className="w-4.5 h-4.5 mr-2" strokeWidth={1.5} />
                    Novo chat
                  </span>
                  <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/[0.08] bg-white/[0.03] px-1.5 font-mono text-[10px] font-medium text-gray-500">
                    <span>⌘</span>K
                  </kbd>
                </Button>

                <SidebarItem
                  href="/workspace"
                  icon={FolderOpen}
                  label="Workspace"
                  isActive={pathname.startsWith("/workspace")}
                />

                <SidebarItem
                  href="/integracoes"
                  icon={Plug}
                  label="Integrações"
                  isActive={pathname.startsWith("/integracoes")}
                />

                {showChatSections && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSearching((prev) => !prev)}
                      className={cn(
                        "relative w-full justify-start px-3 h-9.5 transition-all duration-200 flex items-center text-sm rounded-lg border border-transparent font-medium",
                        isSearching
                          ? "bg-white/[0.04] text-white border-white/[0.08]"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full transition-all duration-200",
                          isSearching ? "bg-indigo-500 opacity-100" : "bg-indigo-500 opacity-0"
                        )}
                      />
                      <Search className="w-4.5 h-4.5 mr-3 shrink-0 opacity-70" strokeWidth={1.5} />
                      <span className="truncate">Buscar chats</span>
                    </button>

                    {isSearching && (
                      <div className="mt-1 px-1 pb-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={1.5} />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por título..."
                            className="h-9 pl-9 pr-8 text-xs rounded-lg bg-[#0a0a0a] border-white/[0.08] text-white placeholder:text-gray-600 focus-visible:ring-indigo-500/20"
                            autoFocus
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-[9px] text-gray-600 mt-1.5 px-2">
                          Ordenado por: relevância, recência e chat ativo
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showChatSections && (
                <div>
                  <h3 className="text-[10px] font-semibold text-gray-500/80 px-3 mb-2 uppercase tracking-widest">
                    Recentes
                  </h3>
                  <div className="space-y-1">
                    {filteredChats.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-gray-600">
                        {searchQuery ? "Nenhum chat encontrado" : "Nenhuma conversa recente"}
                      </p>
                    ) : (
                      filteredChats.map((chat) => (
                        <ChatListItem
                          key={chat.id}
                          chat={chat}
                          isActive={activeChatId === chat.id}
                          isMenuOpen={openMenuId === chat.id}
                          onToggleMenu={() =>
                            setOpenMenuId((current) => (current === chat.id ? null : chat.id))
                          }
                          onCloseMenu={() => setOpenMenuId(null)}
                          onDelete={() => handleDelete(chat.id)}
                          onShare={() => handleShare(chat)}
                        />
                      ))
                    )}
                    {shareFeedback && shareFeedback !== "error" && (
                      <p className="px-3 py-1 text-xs text-green-400/90 font-medium">Link copiado!</p>
                    )}
                    {shareFeedback === "error" && (
                      <p className="px-3 py-1 text-xs text-red-400/90 font-medium">
                        Não foi possível copiar o link
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Footer */}
            <div ref={userMenuRef} className="p-3 border-t border-white/[0.08] relative">
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full left-3 right-3 mb-2 z-50 p-1.5 rounded-xl border border-white/[0.08] bg-[#0c0c0c]/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] space-y-0.5"
                  >
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                      Configurações da conta
                    </Link>
                    {!isPro && (
                      <Link
                        href="/dashboard/upgrade"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-500" strokeWidth={1.5} />
                        Fazer Upgrade para Pro
                      </Link>
                    )}
                    <div className="h-[1px] bg-white/[0.06] my-1" />
                    <Link
                      href="/login"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" strokeWidth={1.5} />
                      Sair
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.03] transition-all duration-200">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-3 cursor-pointer text-left group min-w-0 flex-1 mr-2"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-xs group-hover:shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all shrink-0">
                    GG
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white group-hover:text-blue-200 transition-colors truncate">
                      Gabriel Go...
                    </span>
                    <span className="text-[10px] text-gray-500 leading-none mt-0.5">
                      {isPro ? "Pro" : "Free"}
                    </span>
                  </div>
                </button>
                {isPro ? (
                  <span className="inline-flex items-center justify-center shrink-0 h-8 rounded-lg px-3 text-[11px] font-bold bg-gradient-to-r from-blue-500/15 to-indigo-500/15 border border-indigo-500/25 text-indigo-300">
                    PRO
                  </span>
                ) : (
                  <Link
                    href="/dashboard/upgrade"
                    className="inline-flex items-center justify-center shrink-0 h-8 rounded-lg px-3 text-[11px] font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:via-indigo-500 hover:to-indigo-600 text-white transition-all duration-300 active:scale-[0.98] shadow-[0_0_15px_rgba(79,70,229,0.25)] hover:shadow-[0_0_20px_rgba(79,70,229,0.45)]"
                  >
                    Atualizar
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 left-4 z-[100] text-gray-300 hover:text-white transition-all p-2 bg-[#0c0c0c]/90 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)] active:scale-95"
          onClick={() => setIsOpen(true)}
          title="Abrir barra lateral"
          aria-label="Abrir barra lateral"
        >
          <PanelLeftOpen className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>
      )}
    </>
  );
}
