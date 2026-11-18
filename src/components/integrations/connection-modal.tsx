"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertCircle, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MetaLogo,
  InstagramLogo,
  GoogleLogo,
  TikTokLogo,
} from "@/components/icons/ad-platform-logos";
import { type AdPlatform, type Integration } from "@/lib/integrations";
import { api } from "@/lib/api";
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
      if (integration.id === "instagram") {
        const response = await api.connectInstagram();
        if (response && response.auth_url) {
          window.location.href = response.auth_url;
          return;
        }
        throw new Error("auth_url não retornado pelo backend");
      }

      const defaultName = `Conta ${integration.name}`;
      await onConnect(integration.id, defaultName);
      setState("success");
      setTimeout(() => {
        onClose();
      }, 1200);
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="connection-title"
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
                  >
                    <Logo className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h2 id="connection-title" className="text-base font-semibold text-white">
                      {integration.name}
                    </h2>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      Autorização OAuth 2.0
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

              {state === "idle" && (
                <div className="space-y-5">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Autorize o AtlasAI a se conectar com sua conta do{" "}
                    <strong className="text-white font-semibold">{integration.name}</strong> para
                    gerenciamento centralizado.
                  </p>

                  <div className="space-y-2.5 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Permissões concedidas
                    </p>
                    <ul className="space-y-2">
                      {integration.permissions.map((permission) => (
                        <li
                          key={permission}
                          className="flex items-start gap-2.5 text-xs text-gray-300"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 h-10 border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAuthorize}
                      className="flex-1 h-10 bg-white hover:bg-gray-100 text-black font-semibold text-sm transition-all"
                    >
                      Autorizar conta
                    </Button>
                  </div>
                </div>
              )}

              {state === "loading" && (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-7 h-7 text-white animate-spin mb-4" />
                  <p className="text-sm text-white font-semibold">Conectando ao {integration.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Aguardando confirmação segura via OAuth...</p>
                </div>
              )}

              {state === "success" && (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mb-3.5">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm text-white font-semibold">Conectado com sucesso</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Sua conta foi vinculada e já está pronta para o AtlasAI.
                  </p>
                </div>
              )}

              {state === "error" && (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-500/15 flex items-center justify-center mb-3.5">
                    <AlertCircle className="w-6 h-6 text-rose-400" />
                  </div>
                  <p className="text-sm text-white font-semibold">Falha na autorização</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Verifique as permissões de acesso e tente novamente.
                  </p>
                  <div className="flex gap-2.5 mt-6 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 h-10 border-white/10 text-gray-300 hover:bg-white/5"
                    >
                      Fechar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAuthorize}
                      className="flex-1 h-10 bg-white text-black hover:bg-gray-100 font-semibold"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-white/[0.04] bg-white/[0.015]">
              <p className="text-[10px] text-gray-500 text-center">
                Criptografia AES-256. Nenhuma credencial ou senha é transmitida ao navegador.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
