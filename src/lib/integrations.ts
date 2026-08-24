export type IntegrationStatus = "disconnected" | "connected" | "syncing" | "error";

export type AdPlatform = "meta" | "google" | "tiktok";

export type Integration = {
  id: AdPlatform;
  name: string;
  category: string;
  description: string;
  brandColor: string;
  status: IntegrationStatus;
  accountName?: string;
  lastSyncedAt?: number;
  permissions: string[];
};

export const INTEGRATIONS: Integration[] = [
  {
    id: "meta",
    name: "Meta Ads",
    category: "SOCIAL PERFORMANCE",
    description: "Conecte campanhas, conjuntos de anúncios e conversões da sua conta Meta em um só fluxo.",
    brandColor: "#1877F2",
    status: "disconnected",
    permissions: [
      "Ler campanhas e conjuntos de anúncios",
      "Acessar métricas de conversão",
      "Ler dados de público-alvo",
      "Sincronizar gastos diários",
    ],
  },
  {
    id: "google",
    name: "Google Ads",
    category: "SEARCH & DISPLAY",
    description: "Acompanhe investimento, cliques, palavras-chave e resultados de pesquisa com clareza.",
    brandColor: "#FBBF24",
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
    description: "Traga alcance, visualizações e conversões do TikTok para o seu workspace.",
    brandColor: "#FF0050",
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
    return parsed.length === INTEGRATIONS.length ? parsed : INTEGRATIONS;
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
