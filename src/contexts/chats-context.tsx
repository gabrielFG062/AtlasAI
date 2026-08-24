"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Chat, createChat, loadChats, saveChats } from "@/lib/chats";

type ChatsContextValue = {
  chats: Chat[];
  hydrated: boolean;
  createNewChat: () => Chat;
  deleteChat: (id: string) => void;
  getChatById: (id: string) => Chat | undefined;
};

const ChatsContext = createContext<ChatsContextValue | null>(null);

export function ChatsProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChats(loadChats());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveChats(chats);
  }, [chats, hydrated]);

  const createNewChat = useCallback(() => {
    const chat = createChat();
    setChats((prev) => [chat, ...prev]);
    return chat;
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getChatById = useCallback(
    (id: string) => chats.find((c) => c.id === id),
    [chats]
  );

  const value = useMemo(
    () => ({ chats, hydrated, createNewChat, deleteChat, getChatById }),
    [chats, hydrated, createNewChat, deleteChat, getChatById]
  );

  return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>;
}

export function useChats() {
  const ctx = useContext(ChatsContext);
  if (!ctx) throw new Error("useChats must be used within ChatsProvider");
  return ctx;
}
