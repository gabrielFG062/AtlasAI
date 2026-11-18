export type IntegrationStatus = "disconnected" | "connected" | "syncing" | "error";

export type AdPlatform = "meta" | "instagram" | "google" | "tiktok";

export type Integration = {
  id: AdPlatform;
  name: string;
  category: string;
  description: string;
  brandColor: string;
  status: IntegrationStatus;
  accountName?: string;
  accountHandle?: string;
  avatarUrl?: string;
  isFeatured?: boolean;
  lastSyncedAt?: number;
  permissions: string[];
};

export const INTEGRATIONS: Integration[] = [
  {
    id: "meta",
    name: "Meta Ads",
    category: "SOCIAL PERFORMANCE",
    description: "Gerencie campanhas, anúncios e métricas.",
    brandColor: "#1877F2",
    status: "connected",
    accountName: "Atlas Digital Enterprise",
    accountHandle: "act_492019482",
    lastSyncedAt: Date.now() - 1000 * 60 * 18,
    permissions: [
      "Ler campanhas e conjuntos de anúncios",
      "Acessar métricas de conversão",
      "Ler dados de público-alvo",
      "Sincronizar gastos diários",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "CONTENT & ENGAGEMENT",
    description: "Crie designs, publique posts, Reels e gerencie seu conteúdo.",
    brandColor: "#E1306C",
    status: "disconnected",
    isFeatured: true,
    permissions: [
      "Publicar posts, stories e Reels automaticamente",
      "Acessar métricas de engajamento e alcance",
      "Gerenciar calendário editorial e comentários",
      "Sincronizar perfil profissional e insights",
    ],
  },
  {
    id: "google",
    name: "Google Ads",
    category: "SEARCH & DISPLAY",
    description: "Gerencie campanhas e acompanhe resultados.",
    brandColor: "#4285F4",
    status: "disconnected",
    permissions: [
      "Ler campanhas e grupos de anúncios",
      "Acessar palavras-chave e lances",
      "Ler conversões e custos",
      "Sincronizar dados de display",
    ],
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    category: "SHORT-FORM VIDEO",
    description: "Crie campanhas e acompanhe o desempenho dos anúncios.",
    brandColor: "#00F2FE",
    status: "disconnected",
    permissions: [
      "Ler campanhas e anúncios",
      "Acessar métricas de vídeo",
      "Ler conversões e gastos",
      "Sincronizar dados de alcance",
    ],
  },
];

export const INTEGRATION_STORAGE_KEY = "aura-integrations";

export function loadIntegrations(): Integration[] {
  if (typeof window === "undefined") return INTEGRATIONS;
  try {
    const raw = localStorage.getItem(INTEGRATION_STORAGE_KEY);
    if (!raw) return INTEGRATIONS;
    const parsed = JSON.parse(raw) as Integration[];
    if (!Array.isArray(parsed)) return INTEGRATIONS;

    // Garante que todas as integrações definidas existam (inclusive novas como instagram)
    const merged = INTEGRATIONS.map((base) => {
      const existing = parsed.find((p) => p.id === base.id);
      if (!existing) return base;
      return {
        ...base,
        status: existing.status ?? base.status,
        accountName: existing.accountName ?? base.accountName,
        accountHandle: existing.accountHandle ?? base.accountHandle,
        avatarUrl: existing.avatarUrl ?? base.avatarUrl,
        lastSyncedAt: existing.lastSyncedAt ?? base.lastSyncedAt,
      };
    });
    return merged;
  } catch {
    return INTEGRATIONS;
  }
}

export function saveIntegrations(integrations: Integration[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTEGRATION_STORAGE_KEY, JSON.stringify(integrations));
}

export function formatLastSync(timestamp?: number): string {
  if (!timestamp) return "Nunca sincronizado";
  const date = new Date(timestamp);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
