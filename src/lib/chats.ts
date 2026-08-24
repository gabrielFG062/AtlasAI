export type Chat = {
  id: string;
  title: string;
  createdAt: number;
};

export const CHATS_STORAGE_KEY = "aura-chats";

const SEED_CHATS: Chat[] = [
  { id: "1", title: "Tela de Login Nextjs", createdAt: 1 },
  { id: "2", title: "Setup AWS ECS", createdAt: 2 },
  { id: "3", title: "Pipeline CI/CD Github", createdAt: 3 },
  { id: "4", title: "Otimizar Dockerfile", createdAt: 4 },
];

export function createChat(title = "Nova conversa"): Chat {
  return {
    id: crypto.randomUUID(),
    title,
    createdAt: Date.now(),
  };
}

export function loadChats(): Chat[] {
  if (typeof window === "undefined") return SEED_CHATS;

  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(SEED_CHATS));
      return SEED_CHATS;
    }
    const parsed = JSON.parse(raw) as Chat[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CHATS;
  } catch {
    return SEED_CHATS;
  }
}

export function saveChats(chats: Chat[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
}

export function getChatShareUrl(chatId: string): string {
  if (typeof window === "undefined") return `/dashboard/chat/${chatId}`;
  return `${window.location.origin}/dashboard/chat/${chatId}`;
}
