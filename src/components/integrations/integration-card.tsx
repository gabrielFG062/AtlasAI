"use client";

import { motion } from "framer-motion";
import { RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/integrations/status-indicator";
import { formatLastSync, type Integration } from "@/lib/integrations";
import { MetaLogo, GoogleLogo, TikTokLogo } from "@/components/icons/ad-platform-logos";
import { cn } from "@/lib/utils";

type IntegrationCardProps = {
  integration: Integration;
  index: number;
  onConnect: () => void;
  onManage: () => void;
  onSync: () => void;
};

const brandLogos: Record<Integration["id"], React.ElementType> = {
  meta: MetaLogo,
  google: GoogleLogo,
  tiktok: TikTokLogo,
};

const brandBadgeStyles: Record<Integration["id"], string> = {
  meta: "bg-[#1877F2]/10 border-[#1877F2]/20 text-[#1877F2]",
  google: "bg-[#FBBF24]/10 border-[#FBBF24]/20 text-[#FBBF24]",
  tiktok: "bg-[#FF0050]/10 border-[#FF0050]/20 text-[#FF0050]",
};

export function IntegrationCard({
  integration,
  index,
  onConnect,
  onManage,
  onSync,
}: IntegrationCardProps) {
  const isConnected = integration.status === "connected";
  const isSyncing = integration.status === "syncing";
  const isError = integration.status === "error";
  const Logo = brandLogos[integration.id];

  const metadata = [
    { label: "Data sync", value: isConnected ? "Ativo" : "—" },
    { label: "Account access", value: integration.accountName || "—" },
    { label: "Campaign data", value: isConnected ? "Disponível" : "—" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.08 }}
      className={cn(
        "group relative flex flex-col p-6 rounded-xl border transition-all duration-200",
        "bg-[#171B1A] border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-11 h-11 rounded-lg border flex items-center justify-center overflow-hidden",
              brandBadgeStyles[integration.id]
            )}
          >
            <Logo className="w-7 h-7 object-contain" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{integration.name}</h3>
            <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase mt-0.5">
              {integration.category}
            </p>
          </div>
        </div>
        <StatusIndicator status={integration.status} />
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-6">{integration.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {metadata.map((item) => (
          <div
            key={item.label}
            className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02]"
          >
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">{item.label}</p>
            <p className="text-xs text-gray-300 mt-0.5 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/[0.04]">
        {!isConnected ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Nenhuma conta vinculada</p>
            <Button
              type="button"
              onClick={onConnect}
              className="w-full h-10 bg-[#C8F04A] text-[#0a0a0a] hover:bg-[#d4ff5c] font-semibold"
            >
              Conectar
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Última sincronização</span>
              <span className="text-gray-300">{formatLastSync(integration.lastSyncedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-1 inline-flex items-center gap-1.5 text-[10px] text-[#C8F04A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F04A]" />
                Sync healthy
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSync}
                disabled={isSyncing}
                className="h-8 px-3 border-white/10 text-gray-300 hover:bg-white/5"
              >
                <RefreshCw
                  className={cn("w-3.5 h-3.5 mr-1.5", isSyncing && "animate-spin")}
                />
                {isSyncing ? "Sincronizando" : "Sincronizar"}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onManage}
                className="h-8 px-3 bg-white/[0.06] hover:bg-white/10 text-white"
              >
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Gerenciar
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
