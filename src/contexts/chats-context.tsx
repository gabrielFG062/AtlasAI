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
import { api, getAuthToken } from "@/lib/api";

type ChatsContextValue = {
  chats: Chat[];
  hydrated: boolean;
  createNewChat: (title?: string) => Promise<Chat>;
  deleteChat: (id: string) => Promise<void>;
  getChatById: (id: string) => Chat | undefined;
  refreshChats: () => Promise<void>;
};

const ChatsContext = createContext<ChatsContextValue | null>(null);

export function ChatsProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refreshChats = useCallback(async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const items = await api.listConversations();
        const mapped: Chat[] = items.map((c) => ({
          id: String(c.id),
          title: c.title,
          createdAt: new Date(c.created_at).getTime(),
        }));
        setChats(mapped);
        return;
      } catch (err) {
        console.error("Falha ao obter conversas do backend:", err);
      }
    }
    setChats(loadChats());
  }, []);

  useEffect(() => {
    let isMounted = true;
    const token = getAuthToken();
    if (token) {
      api
        .listConversations()
        .then((items) => {
          if (!isMounted) return;
          const mapped: Chat[] = items.map((c) => ({
            id: String(c.id),
            title: c.title,
            createdAt: new Date(c.created_at).getTime(),
          }));
          setChats(mapped);
          setHydrated(true);
        })
        .catch(() => {
          if (!isMounted) return;
          setChats(loadChats());
          setHydrated(true);
        });
    } else {
      setChats(loadChats());
      setHydrated(true);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) saveChats(chats);
  }, [chats, hydrated]);

  const createNewChat = useCallback(async (title = "Nova conversa"): Promise<Chat> => {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await api.createConversation(title);
        const newChat: Chat = {
          id: String(res.id),
          title: res.title || title,
          createdAt: new Date(res.created_at).getTime(),
        };
        setChats((prev) => [newChat, ...prev.filter((c) => c.id !== newChat.id)]);
        return newChat;
      } catch (err) {
        console.error("Falha ao criar conversa no backend:", err);
      }
    }

    const localChat = createChat(title);
    setChats((prev) => [localChat, ...prev]);
    return localChat;
  }, []);

  const deleteChat = useCallback(async (id: string): Promise<void> => {
    const token = getAuthToken();
    if (token) {
      try {
        await api.deleteConversation(id);
      } catch (err) {
        console.error("Falha ao remover conversa no backend:", err);
      }
    }
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getChatById = useCallback(
    (id: string) => chats.find((c) => c.id === id),
    [chats]
  );

  const value = useMemo(
    () => ({ chats, hydrated, createNewChat, deleteChat, getChatById, refreshChats }),
    [chats, hydrated, createNewChat, deleteChat, getChatById, refreshChats]
  );

  return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>;
}

export function useChats() {
  const ctx = useContext(ChatsContext);
  if (!ctx) throw new Error("useChats must be used within ChatsProvider");
  return ctx;
}
