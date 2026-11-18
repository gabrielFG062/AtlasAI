"use client";

import { motion } from "framer-motion";
import {
  RefreshCw,
  Settings,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/integrations/status-indicator";
import { formatLastSync, type Integration } from "@/lib/integrations";
import {
  MetaLogo,
  InstagramLogo,
  GoogleLogo,
  TikTokLogo,
} from "@/components/icons/ad-platform-logos";
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
  instagram: InstagramLogo,
  google: GoogleLogo,
  tiktok: TikTokLogo,
};

const brandBadgeStyles: Record<Integration["id"], string> = {
  meta: "bg-[#1877F2]/10 border-[#1877F2]/20 text-[#1877F2]",
  instagram: "bg-gradient-to-tr from-[#F58529]/15 via-[#DD2A7B]/15 to-[#8134AF]/15 border-[#E1306C]/30 text-[#E1306C]",
  google: "bg-[#4285F4]/10 border-[#4285F4]/20 text-[#4285F4]",
  tiktok: "bg-[#00F2FE]/10 border-[#00F2FE]/20 text-[#00F2FE]",
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
  const isFeatured = !!integration.isFeatured;
  const Logo = brandLogos[integration.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col justify-between h-full rounded-2xl border transition-all duration-300 p-6",
        "bg-[#0e1011] hover:bg-[#121517]",
        isFeatured
          ? "border-white/[0.14] shadow-[0_0_35px_rgba(225,48,108,0.08)] hover:border-[#E1306C]/40 hover:shadow-[0_0_45px_rgba(225,48,108,0.15)] ring-1 ring-white/[0.05]"
          : "border-white/[0.08] hover:border-white/[0.16] shadow-lg shadow-black/40"
      )}
    >
      {/* Glow sutil para destaque do Instagram */}
      {isFeatured && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#E1306C]/10 to-transparent blur-2xl pointer-events-none rounded-full" />
      )}

      {/* Topo do Card */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                brandBadgeStyles[integration.id]
              )}
            >
              <Logo className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {integration.name}
                </h3>
                {isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-gradient-to-r from-[#E1306C]/20 to-[#8134AF]/20 border border-[#E1306C]/30 text-[#ff80ab]">
                    <Sparkles className="w-2.5 h-2.5 text-[#ff80ab]" />
                    Destaque
                  </span>
                )}
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase mt-0.5">
                {integration.category}
              </p>
            </div>
          </div>

          <StatusIndicator status={integration.status} />
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-400 leading-relaxed min-h-[40px] mb-6">
          {integration.description}
        </p>

        {/* Informações detalhadas da conta após conexão */}
        {isConnected ? (
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] mb-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-400">Conta conectada</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Ativa
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {/* Foto de perfil ou Avatar monograma */}
              {integration.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={integration.avatarUrl}
                  alt={integration.accountName || "Avatar"}
                  className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                  {integration.accountName?.charAt(0) || "A"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {integration.accountName || "Conta Vinculada"}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {integration.accountHandle || "OAuth 2.0 Conectado"}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-gray-500">
              <span>Última sincronização</span>
              <span className="text-gray-300 font-medium">
                {formatLastSync(integration.lastSyncedAt)}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.015] mb-6">
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>Status</span>
              <span className="text-gray-400">Nenhuma conta autorizada</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              Conexão via OAuth 2.0 com criptografia ponta a ponta.
            </p>
          </div>
        )}
      </div>

      {/* Rodapé / Ações */}
      <div className="pt-4 border-t border-white/[0.06]">
        {!isConnected ? (
          <Button
            type="button"
            onClick={onConnect}
            className={cn(
              "w-full h-10 text-sm font-semibold transition-all duration-200",
              isFeatured
                ? "bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                : "bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.08]"
            )}
          >
            Conectar conta
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSync}
              disabled={isSyncing}
              className="flex-1 h-9 border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-xs font-medium"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5 mr-1.5", isSyncing && "animate-spin text-blue-400")}
              />
              {isSyncing ? "Sincronizando..." : "Sincronizar"}
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onManage}
              className="h-9 px-3 bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 hover:text-white border border-white/[0.06] text-xs font-medium"
              title="Gerenciar conexão"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              Gerenciar conexão
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
