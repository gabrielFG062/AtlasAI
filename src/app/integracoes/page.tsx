"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Activity } from "lucide-react";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { ConnectionModal } from "@/components/integrations/connection-modal";
import { useIntegrations } from "@/contexts/integrations-context";
import { type AdPlatform } from "@/lib/integrations";
import { cn } from "@/lib/utils";

export default function IntegracoesPage() {
  const { integrations, hydrated, connect, sync, disconnect } = useIntegrations();
  const [selectedId, setSelectedId] = useState<AdPlatform | null>(null);

  const selectedIntegration = integrations.find((i) => i.id === selectedId) ?? null;
  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  const handleConnect = (id: AdPlatform, accountName: string) => {
    connect(id, accountName);
  };

  const handleDisconnect = (id: AdPlatform) => {
    disconnect(id);
  };

  if (!hydrated) {
    return <div className="h-full w-full bg-[#080A0A]" />;
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-[#080A0A] text-white custom-scrollbar">
      <div className="relative z-10 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <span>Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-300">Integrações</span>
            </nav>

            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
                Integrações
              </h1>
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md border border-white/[0.06] bg-white/[0.02]">
                <Activity className="w-3.5 h-3.5 text-[#C8F04A]" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                  SYSTEM OPERATIONAL
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Conecte seus canais de mídia paga e centralize os sinais de performance em um único
              workspace.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.06] bg-white/[0.02]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8F04A]" />
              <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                INTEGRATION HUB / {String(connectedCount).padStart(2, "0")} CHANNELS
              </span>
            </div>
          </div>

          <div className="relative w-full md:w-72 h-24 md:h-32 rounded-xl border border-white/[0.04] bg-white/[0.02] overflow-hidden hidden md:block">
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="20%" cy="50%" r="4" fill="#1877F2" opacity="0.6" />
              <circle cx="80%" cy="50%" r="4" fill="#FF0050" opacity="0.6" />
              <circle cx="50%" cy="50%" r="6" fill="#C8F04A" opacity="0.8" />
              <circle cx="50%" cy="20%" r="4" fill="#FBBF24" opacity="0.6" />
              <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="rgba(200,240,74,0.25)" strokeWidth="1.5" />
              <line x1="80%" y1="50%" x2="50%" y2="50%" stroke="rgba(200,240,74,0.25)" strokeWidth="1.5" />
              <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="rgba(200,240,74,0.25)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {integrations.map((integration, index) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              index={index}
              onConnect={() => setSelectedId(integration.id)}
              onManage={() => handleDisconnect(integration.id)}
              onSync={() => sync(integration.id)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]"
        >
          <p className="text-[11px] text-gray-600 leading-relaxed">
            <span className="text-[#C8F04A]">Segurança:</span> as integrações utilizam OAuth 2.0.
            Credenciais e client secrets são processados apenas no servidor e nunca expostos no
            navegador. Em produção, o fluxo de autorização é redirecionado para o backend da AtlasAI.
          </p>
        </motion.div>
      </div>

      <ConnectionModal
        integration={selectedIntegration}
        isOpen={!!selectedIntegration}
        onClose={() => setSelectedId(null)}
        onConnect={handleConnect}
      />
    </div>
  );
}
