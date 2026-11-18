"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { ConnectionModal } from "@/components/integrations/connection-modal";
import { ManageModal } from "@/components/integrations/manage-modal";
import { useIntegrations } from "@/contexts/integrations-context";
import { type AdPlatform } from "@/lib/integrations";

export default function IntegracoesPage() {
  const { integrations, hydrated, connect, sync, disconnect } = useIntegrations();
  const [selectedId, setSelectedId] = useState<AdPlatform | null>(null);
  const [managingId, setManagingId] = useState<AdPlatform | null>(null);

  const selectedIntegration = integrations.find((i) => i.id === selectedId) ?? null;
  const managingIntegration = integrations.find((i) => i.id === managingId) ?? null;
  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  const handleConnect = async (id: AdPlatform, accountName: string) => {
    await connect(id, accountName);
  };

  const handleDisconnect = async (id: AdPlatform) => {
    await disconnect(id);
  };

  if (!hydrated) {
    return <div className="h-full w-full bg-[#070809]" />;
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-[#070809] text-white custom-scrollbar selection:bg-white/20">
      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <span>Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-gray-300 font-medium">Integrações</span>
            </nav>

            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
                Integrações
              </h1>
              <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                  Conexões Ativas
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Conecte suas plataformas para permitir que o AtlasAI gerencie suas campanhas e publicações.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-gray-400">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  <strong className="text-white font-semibold">{connectedCount}</strong> de{" "}
                  {integrations.length} canais conectados
                </span>
              </div>
              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-gray-500">
                <Sparkles className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>Instagram com geração de criativos e automação</span>
              </div>
            </div>
          </div>

          {/* Gráfico decorativo sutil minimalista */}
          <div className="relative w-full md:w-64 h-24 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden hidden md:flex items-center justify-center p-4">
            <div className="w-full flex items-center justify-between text-xs text-gray-500">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#1877F2]" />
                <span className="text-[10px]">Meta</span>
              </div>
              <div className="h-[1px] flex-1 bg-white/[0.06] mx-2" />
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E1306C] shadow-[0_0_8px_rgba(225,48,108,0.5)]" />
                <span className="text-[10px] text-white font-medium">Insta</span>
              </div>
              <div className="h-[1px] flex-1 bg-white/[0.06] mx-2" />
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span className="text-[10px]">Google</span>
              </div>
              <div className="h-[1px] flex-1 bg-white/[0.06] mx-2" />
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00F2FE]" />
                <span className="text-[10px]">TikTok</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de 4 Cards Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {integrations.map((integration, index) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              index={index}
              onConnect={() => setSelectedId(integration.id)}
              onManage={() => setManagingId(integration.id)}
              onSync={() => sync(integration.id)}
            />
          ))}
        </div>

        {/* Nota de rodapé sobre privacidade e autenticação segura */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] flex items-start sm:items-center gap-3.5"
        >
          <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-white font-medium">Segurança e Privacidade:</span> Todas as
            conexões utilizam protocolo oficial OAuth 2.0. As permissões são restritas à gestão de
            anúncios e postagens autorizadas, sem acesso a dados pessoais ou senhas.
          </p>
        </motion.div>
      </div>

      <ConnectionModal
        integration={selectedIntegration}
        isOpen={!!selectedIntegration}
        onClose={() => setSelectedId(null)}
        onConnect={handleConnect}
      />

      <ManageModal
        integration={managingIntegration}
        isOpen={!!managingIntegration}
        onClose={() => setManagingId(null)}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
