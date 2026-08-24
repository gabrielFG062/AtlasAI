export type ChatCategoryId =
  | "chatgpt-image-2"
  | "nano-banana-lite"
  | "nano-banana-2"
  | "nano-banana-pro"
  | "claude-design";

export type ChatCategoryTier = "free" | "pro";

export type ChatCategory = {
  id: ChatCategoryId;
  label: string;
  description: string;
  tier: ChatCategoryTier;
};

export const CHAT_CATEGORIES: ChatCategory[] = [
  {
    id: "chatgpt-image-2",
    label: "ChatGPT IMAGE 2",
    description: "Criação e edição inteligente de imagens.",
    tier: "free",
  },
  {
    id: "nano-banana-lite",
    label: "Nano Banana Lite",
    description:
      "Modelo super leve e rápido para respostas instantâneas e tarefas do dia a dia.",
    tier: "free",
  },
  {
    id: "nano-banana-2",
    label: "Nano Banana 2",
    description:
      "Capacidades cognitivas avançadas, raciocínio lógico e análises profundas.",
    tier: "free",
  },
  {
    id: "nano-banana-pro",
    label: "Nano Banana PRO",
    description: "Designs e imagens detalhadas com alta qualidade.",
    tier: "pro",
  },
  {
    id: "claude-design",
    label: "Claude Design",
    description: "Criação de interfaces, layouts e conceitos visuais.",
    tier: "pro",
  },
];

export const DEFAULT_CHAT_CATEGORY: ChatCategoryId = "nano-banana-lite";

export function getChatCategory(id: ChatCategoryId): ChatCategory {
  return CHAT_CATEGORIES.find((c) => c.id === id) ?? CHAT_CATEGORIES[1];
}

export function getAvailableChatCategories(isPro: boolean): ChatCategory[] {
  return isPro ? CHAT_CATEGORIES : CHAT_CATEGORIES.filter((c) => c.tier === "free");
}

export function isCategoryAvailable(id: ChatCategoryId, isPro: boolean): boolean {
  return isPro || getChatCategory(id).tier === "free";
}
