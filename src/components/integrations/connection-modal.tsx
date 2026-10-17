"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertCircle, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetaLogo, GoogleLogo, TikTokLogo } from "@/components/icons/ad-platform-logos";
import { type AdPlatform, type Integration } from "@/lib/integrations";
import { cn } from "@/lib/utils";

type ModalState = "idle" | "loading" | "success" | "error";

type ConnectionModalProps = {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (id: AdPlatform, accountName: string) => Promise<void> | void;
};

const brandLogos: Record<AdPlatform, React.ElementType> = {
  meta: MetaLogo,
  google: GoogleLogo,
  tiktok: TikTokLogo,
};

const brandColors: Record<AdPlatform, string> = {
  meta: "#1877F2",
  google: "#FBBF24",
  tiktok: "#FF0050",
};

export function ConnectionModal({
  integration,
  isOpen,
  onClose,
  onConnect,
}: ConnectionModalProps) {
  const [state, setState] = useState<ModalState>("idle");

  useEffect(() => {
    if (!isOpen) setState("idle");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!integration) return null;

  const handleAuthorize = async () => {
    setState("loading");
    try {
      await onConnect(integration.id, `Conta ${integration.name}`);
      setState("success");
    } catch {
      setState("error");
    }
  };

  const color = brandColors[integration.id];
  const Logo = brandLogos[integration.id];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="connection-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#171B1A] shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
                  >
                    <Logo className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h2 id="connection-title" className="text-lg font-semibold text-white">
                      {integration.name}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      OAuth Authorization
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {state === "idle" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Autorize a AtlasAI a acessar os dados selecionados da sua conta.
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Permissões solicitadas
                    </p>
                    <ul className="space-y-2">
                      {integration.permissions.map((permission) => (
                        <li
                          key={permission}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#C8F04A] shrink-0 mt-0.5" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 h-11 border-white/10 text-gray-300 hover:bg-white/5"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAuthorize}
                      className="flex-1 h-11 bg-[#C8F04A] text-[#0a0a0a] hover:bg-[#d4ff5c] font-semibold"
                    >
                      Continuar para autorização
                    </Button>
                  </div>
                </div>
              )}

              {state === "loading" && (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-8 h-8 text-[#C8F04A] animate-spin mb-4" />
                  <p className="text-sm text-white font-medium">Conectando com {integration.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Aguardando autorização segura...</p>
                </div>
              )}

              {state === "success" && (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#C8F04A]/15 flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-[#C8F04A]" />
                  </div>
                  <p className="text-sm text-white font-medium">Conectado com sucesso</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sua conta está sincronizada com o workspace.
                  </p>
                </div>
              )}

              {state === "error" && (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-sm text-white font-medium">Falha na autorização</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Verifique suas permissões e tente novamente.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="h-10 border-white/10 text-gray-300 hover:bg-white/5"
                    >
                      Fechar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAuthorize}
                      className="h-10 bg-[#C8F04A] text-[#0a0a0a] hover:bg-[#d4ff5c]"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-white/[0.04] bg-white/[0.02]">
              <p className="text-[10px] text-gray-600 text-center">
                Seus dados são criptografados. Nunca armazenamos senhas ou client secrets no
                frontend.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
