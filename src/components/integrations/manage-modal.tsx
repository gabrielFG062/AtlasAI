"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MetaLogo,
  InstagramLogo,
  GoogleLogo,
  TikTokLogo,
} from "@/components/icons/ad-platform-logos";
import { formatLastSync, type AdPlatform, type Integration } from "@/lib/integrations";
import { cn } from "@/lib/utils";

type ManageModalProps = {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: (id: AdPlatform) => Promise<void> | void;
};

const brandLogos: Record<AdPlatform, React.ElementType> = {
  meta: MetaLogo,
  instagram: InstagramLogo,
  google: GoogleLogo,
  tiktok: TikTokLogo,
};

const brandColors: Record<AdPlatform, string> = {
  meta: "#1877F2",
  instagram: "#E1306C",
  google: "#4285F4",
  tiktok: "#00F2FE",
};

export function ManageModal({
  integration,
  isOpen,
  onClose,
  onDisconnect,
}: ManageModalProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!integration) return null;

  const color = brandColors[integration.id];
  const Logo = brandLogos[integration.id];

  const handleConfirmDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await onDisconnect(integration.id);
      onClose();
    } catch (err) {
      console.error("Erro ao desconectar:", err);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="manage-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d0f11] shadow-2xl shadow-black/80 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />

            <div className="p-6 sm:p-7">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
                  >
                    <Logo className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h2 id="manage-modal-title" className="text-base font-semibold text-white">
                      Gerenciar {integration.name}
                    </h2>
                    <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Conexão Ativa
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dados da Conta */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3.5">
                  {integration.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={integration.avatarUrl}
                      alt={integration.accountName || "Avatar"}
                      className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                      {integration.accountName?.charAt(0) || "A"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {integration.accountName || "Conta Vinculada"}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {integration.accountHandle || "Autenticado via OAuth"}
                    </p>
                  </div>
                </div>

                {/* Detalhes de status e sincronização */}
                <div className="space-y-2 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.015] text-xs text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Status de sincronização</span>
                    <span className="text-gray-200 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Operacional
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                    <span>Última sincronização</span>
                    <span className="text-gray-300 font-medium">
                      {formatLastSync(integration.lastSyncedAt)}
                    </span>
                  </div>
                </div>

                {/* Permissões ativas */}
                <div className="space-y-2 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.015]">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Permissões ativas no AtlasAI
                  </p>
                  <ul className="space-y-1.5 text-xs text-gray-400">
                    {integration.permissions.slice(0, 3).map((perm) => (
                      <li key={perm} className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ações */}
                <div className="pt-2 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-10 border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm"
                  >
                    Fechar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmDisconnect}
                    disabled={isDisconnecting}
                    className="flex-1 h-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-medium text-sm transition-all"
                  >
                    {isDisconnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Desconectando...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Desconectar conta
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
