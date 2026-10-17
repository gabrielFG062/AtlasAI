"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Trash2, Save, Sparkles, AlertTriangle, ArrowLeft, CreditCard, RotateCcw, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSubscription } from "@/contexts/subscription-context";
import {
  formatSubscriptionDate,
  PRO_PRICE_LABEL,
  SUBSCRIPTION_STATUS_LABELS,
} from "@/lib/subscription";
import { api, clearAuthToken } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  const [userInstructions, setUserInstructions] = useState("");
  const [aiResponseStyle, setAiResponseStyle] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isInstructionsSaving, setIsInstructionsSaving] = useState(false);
  const [instructionsMessage, setInstructionsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { subscription, isPro, cancelSubscription, resumeSubscription } = useSubscription();
  const isCanceled = subscription.status === "canceled";

  useEffect(() => {
    let isMounted = true;
    api
      .getMe()
      .then((user) => {
        if (!isMounted) return;
        setFirstName(user.name || "");
        setLastName(user.last_name || "");
        setEmail(user.email || "");
        setUserInstructions(user.custom_instructions || "");
      })
      .catch(() => {
        // Se não autenticado ou indisponível, mantém campos vazios/padrão
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancelSubscription = () => {
    cancelSubscription();
    setShowCancelConfirm(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);
    setProfileMessage(null);
    try {
      await api.updateMe({
        name: firstName.trim(),
        last_name: lastName.trim() || undefined,
      });
      setProfileMessage({ type: "success", text: "Perfil salvo com sucesso." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar perfil.";
      setProfileMessage({ type: "error", text: msg });
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleSaveInstructions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInstructionsSaving(true);
    setInstructionsMessage(null);
    try {
      await api.updateMe({
        custom_instructions: userInstructions,
      });
      setInstructionsMessage({ type: "success", text: "Instruções salvas com sucesso." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar instruções.";
      setInstructionsMessage({ type: "error", text: msg });
    } finally {
      setIsInstructionsSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Informe sua senha para confirmar a exclusão.");
      return;
    }
    setIsDeleting(true);
    setDeleteError("");
    try {
      await api.requestAccountDeletion(deletePassword);
      clearAuthToken();
      router.push("/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao solicitar exclusão de conta.";
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-y-auto bg-black selection:bg-blue-500/30 custom-scrollbar">
      {/* Background Glows (fixed to viewport for smooth scrolling) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] glow-blue blur-[140px] rounded-full opacity-20 pointer-events-none"></div>

      <div className="relative z-10 p-6 md:p-10 max-w-4xl mx-auto w-full space-y-10">
        
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4"
        >
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Configurações</h1>
            <p className="text-gray-400 mt-2">Gerencie sua conta e personalize o comportamento da AtlasAI.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main settings column */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Card 1: Perfil */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl glassmorphism bg-[#0a0a0a]/80"
            >
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
                    {firstName.charAt(0)}{lastName.charAt(0)}
                 </div>
                 <div>
                   <h2 className="text-xl font-medium text-white">Perfil Pessoal</h2>
                   <p className="text-sm text-gray-500">Suas informações básicas de contato.</p>
                 </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Nome</label>
                    <Input 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      icon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Sobrenome</label>
                    <Input 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      icon={<User className="h-4 w-4" />}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">E-mail</label>
                  <Input 
                    value={email} 
                    type="email"
                    onChange={(e) => setEmail(e.target.value)} 
                    disabled
                  />
                  <p className="text-xs text-gray-500 ml-1">O seu e-mail não pode ser alterado por aqui.</p>
                </div>
                {profileMessage && (
                  <p
                    className={`text-xs ml-1 ${
                      profileMessage.type === "success"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {profileMessage.text}
                  </p>
                )}
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isProfileSaving} className="px-6">
                    {isProfileSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar Perfil
                  </Button>
                </div>
              </form>
            </motion.section>

            {/* Card 2: Custom Instructions */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl glassmorphism bg-[#0a0a0a]/80"
            >
              <div className="flex items-center gap-3 mb-6">
                 <Sparkles className="w-6 h-6 text-blue-400" />
                 <div>
                   <h2 className="text-xl font-medium text-white">Instruções Personalizadas</h2>
                   <p className="text-sm text-gray-500">Molde como a inteligência artificial interage com você.</p>
                 </div>
              </div>

              <form onSubmit={handleSaveInstructions} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    O que a IA deve saber sobre você para fornecer respostas melhores?
                  </label>
                  <Textarea 
                    placeholder="Ex: Trabalho como desenvolvedor Backend com Go e AWS..."
                    value={userInstructions}
                    onChange={(e) => setUserInstructions(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Mencione sua stack, nível de experiência e objetivos.</p>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    Como você gostaria que a IA respondesse?
                  </label>
                  <Textarea 
                    placeholder="Ex: Seja conciso. Mostre apenas o código sem explicações triviais."
                    value={aiResponseStyle}
                    onChange={(e) => setAiResponseStyle(e.target.value)}
                  />
                </div>

                {instructionsMessage && (
                  <p
                    className={`text-xs ml-1 ${
                      instructionsMessage.type === "success"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {instructionsMessage.text}
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isInstructionsSaving} className="px-6 bg-white text-black hover:bg-gray-200">
                    {isInstructionsSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-black" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar Instruções
                  </Button>
                </div>
              </form>
            </motion.section>

          </div>

          {/* Right sidebar column for actions */}
          <div className="md:col-span-4 space-y-6">

            {/* Card: Assinatura */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-5 rounded-2xl glassmorphism bg-[#0a0a0a]/80"
            >
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Assinatura
              </h3>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-white">
                    {isPro ? "AtlasAI Pro" : "Gratuito"}
                  </span>
                  {isPro && (
                    <span className="rounded bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-indigo-300 border border-indigo-500/25">
                      PRO
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    isCanceled
                      ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
                      : isPro
                        ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                        : "text-gray-400 bg-white/[0.03] border-white/10"
                  }`}
                >
                  {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
                </span>
              </div>

              {subscription.plan === "pro" ? (
                <div className="space-y-2 text-sm border-t border-white/5 pt-4">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Valor</span>
                    <span className="text-gray-300">{PRO_PRICE_LABEL}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Início</span>
                    <span className="text-gray-300">
                      {formatSubscriptionDate(subscription.startedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">
                      {isCanceled ? "Acesso até" : "Renova em"}
                    </span>
                    <span className="text-gray-300">
                      {formatSubscriptionDate(subscription.renewsAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 border-t border-white/5 pt-4">
                  Desbloqueie os modelos Nano Banana PRO e Claude Design com o plano Pro.
                </p>
              )}

              <div className="mt-5">
                <AnimatePresence mode="wait">
                  {subscription.plan !== "pro" ? (
                    <motion.div key="upgrade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Link
                        href="/dashboard/upgrade"
                        className="inline-flex w-full items-center justify-center h-10 rounded-xl px-4 text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:via-indigo-500 hover:to-indigo-600 text-white transition-all duration-300 active:scale-[0.98] shadow-[0_0_20px_rgba(79,70,229,0.25)]"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Fazer Upgrade
                      </Link>
                    </motion.div>
                  ) : isCanceled ? (
                    <motion.div key="resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                      <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        Sua assinatura foi cancelada e não será renovada. Você mantém os
                        recursos Pro até {formatSubscriptionDate(subscription.renewsAt)}.
                      </p>
                      <Button onClick={resumeSubscription} variant="outline" className="w-full justify-start text-gray-300 border-white/10 hover:bg-white/5">
                        <RotateCcw className="w-4 h-4 mr-3" />
                        Reativar Assinatura
                      </Button>
                    </motion.div>
                  ) : !showCancelConfirm ? (
                    <motion.div key="cancel-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Button onClick={() => setShowCancelConfirm(true)} variant="outline" className="w-full justify-start text-gray-300 border-white/10 hover:bg-white/5">
                        <Trash2 className="w-4 h-4 mr-3" />
                        Cancelar Assinatura
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="cancel-confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                      <p className="text-xs text-gray-300">
                        Você continuará com acesso Pro até{" "}
                        {formatSubscriptionDate(subscription.renewsAt)} e depois voltará ao
                        plano gratuito. Confirmar cancelamento?
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={handleCancelSubscription} className="flex-1 bg-white text-black hover:bg-gray-200">
                          Confirmar
                        </Button>
                        <Button onClick={() => setShowCancelConfirm(false)} variant="outline" className="flex-1 border-white/10 text-gray-300 hover:bg-white/5">
                          Manter
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl glassmorphism bg-[#0a0a0a]/80 border border-red-500/10"
            >
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-3">Encerre sua sessão atual de forma segura.</p>
                  
                  <AnimatePresence mode="wait">
                    {!showLogoutConfirm ? (
                      <motion.div key="logout-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Button onClick={() => setShowLogoutConfirm(true)} variant="outline" className="w-full justify-start text-gray-300 border-white/10 hover:bg-white/5">
                          <LogOut className="w-4 h-4 mr-3" />
                          Sair da Conta
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div key="logout-confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                        <p className="text-xs text-white font-medium">Tem certeza que deseja sair?</p>
                        <div className="flex gap-2">
                          <Button onClick={handleLogout} className="flex-1 bg-white text-black hover:bg-gray-200">Sim, Sair</Button>
                          <Button onClick={() => setShowLogoutConfirm(false)} variant="outline" className="flex-1 border-white/10 text-gray-300 hover:bg-white/5">Cancelar</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-sm text-gray-400 mb-3">Exclua sua conta e apague todos os seus dados e históricos permanentemente.</p>
                  
                  <AnimatePresence mode="wait">
                    {!showDeleteConfirm ? (
                      <motion.div key="delete-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Button onClick={() => setShowDeleteConfirm(true)} variant="outline" className="w-full justify-start text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="w-4 h-4 mr-3" />
                          Excluir Conta
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div key="delete-confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-200 font-medium border-b border-red-500/20 pb-2 mb-2">
                          Atenção: Ação irreversível!
                        </p>
                        <p className="text-xs text-red-300">Todos os seus dados e conversas serão agendados para exclusão. Digite sua senha para confirmar:</p>
                        <Input
                          type="password"
                          placeholder="Senha atual"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="h-10 text-sm mt-2"
                        />
                        {deleteError && (
                          <p className="text-xs text-red-400 mt-1">{deleteError}</p>
                        )}
                        <div className="flex gap-2 mt-3 pt-1">
                          <Button onClick={handleDeleteAccount} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0">
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Confirmar Exclusão
                          </Button>
                          <Button onClick={() => { setShowDeleteConfirm(false); setDeleteError(""); setDeletePassword(""); }} variant="outline" className="flex-1 border-white/10 text-gray-300 hover:bg-white/5">
                            Cancelar
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.section>

          </div>

        </div>
      </div>
    </div>
  );
}
