"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, QrCode, ArrowLeft, Copy, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubscription } from "@/contexts/subscription-context";

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isPro, activatePro } = useSubscription();
  const view = searchParams.get("step") === "payment" ? "payment" : "plans";

  const goToPayment = () => router.push("/dashboard/upgrade?step=payment");
  const goToPlans = () => router.push("/dashboard/upgrade");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qr">("card");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyQr = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      activatePro();
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-y-auto bg-black selection:bg-blue-500/30 custom-scrollbar p-6 md:p-10">
      {/* Background Glows */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] glow-purple blur-[150px] rounded-full opacity-20 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col min-h-full">
        <AnimatePresence mode="wait">
          
          {/* PLANS VIEW */}
          {view === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="mb-10 flex flex-col items-center justify-center text-center">
                <Link href="/dashboard" className="self-start inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Link>
                <Sparkles className="w-10 h-10 text-blue-400 mb-4" />
                <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">Escolha seu Plano</h1>
                <p className="text-gray-400 max-w-xl text-lg">Evolua seu workspace de inteligência artificial com capacidades ilimitadas e modelos cognitivos avançados.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* FREE PLAN */}
                <div className="flex flex-col p-8 rounded-3xl glassmorphism bg-[#0a0a0a]/60 border border-white/5 hover:border-white/10 transition-colors">
                  <h2 className="text-2xl font-semibold text-white mb-2">Gratuito</h2>
                  <p className="text-gray-400 text-sm mb-6 h-10">Ideal para testar e conhecer as capacidades básicas da AtlasAI.</p>
                  <div className="text-4xl font-bold text-white mb-8">R$0<span className="text-lg text-gray-500 font-normal">/mês</span></div>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    {["Acesso ao modelo de IA padrão", "Consultas com limite diário", "Suporte da comunidade", "Histórico retido por 7 dias"].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-gray-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full mt-auto h-12 border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-base">
                    Continuar no Gratuito
                  </Button>
                </div>

                {/* PRO PLAN */}
                <div className="relative flex flex-col p-8 rounded-3xl glassmorphism bg-gradient-to-b from-blue-900/20 to-black/80 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] ring-1 ring-white/5 overflow-hidden transform hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">Recomendado</div>
                  <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                    AtlasAI Pro <Sparkles className="w-5 h-5 text-blue-400" />
                  </h2>
                  <p className="text-gray-400 text-sm mb-6 h-10">Poder absoluto para dominar infraestrutura e automação cloud.</p>
                  <div className="text-4xl font-bold text-white mb-8">R$49<span className="text-lg text-gray-500 font-normal">/mês</span></div>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    {["Modelos PRO: Nano Banana PRO e Claude Design", "Acesso à IA Pro Ultra-rápida", "Consultas Ilimitadas no mês", "Geração ilimitada de Código Terraforms", "Acesso prioritário a novos recursos", "Histórico de chat vitalício", "Suporte Premium VIP"].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-gray-200">
                        <Check className="w-5 h-5 text-blue-400 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {isPro ? (
                    <Button onClick={() => router.push("/dashboard/settings")} variant="outline" className="w-full h-12 mt-auto border-blue-500/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 text-base">
                      <Check className="w-5 h-5 mr-2" />
                      Seu plano atual — Gerenciar
                    </Button>
                  ) : (
                    <Button onClick={goToPayment} className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-base shadow-lg shadow-blue-500/25 mt-auto">
                      Ir para o Plano Pro
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* PAYMENT VIEW */}
          {view === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl mx-auto"
            >
               <button type="button" onClick={goToPlans} className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-6">
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Voltar aos Planos
               </button>

               <div className="p-6 md:p-8 rounded-3xl glassmorphism bg-[#0a0a0a]/90">
                 <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/10">
                   <div>
                     <h2 className="text-2xl font-semibold text-white mb-1">Finalizar Assinatura</h2>
                     <p className="text-gray-400 text-sm">Assinatura AtlasAI Pro (R$49/mês)</p>
                   </div>
                   <div className="hidden sm:flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                     <ShieldCheck className="w-4 h-4" /> Pagamento Seguro
                   </div>
                 </div>

                 {/* Payment Method Toggle */}
                 <div className="flex gap-2 mb-8 bg-[#171717]/80 p-1 rounded-xl">
                   <button 
                     type="button"
                     onClick={() => setPaymentMethod("card")}
                     className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${paymentMethod === 'card' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                   >
                     <CreditCard className="w-4 h-4" /> Cartão de Crédito
                   </button>
                   <button 
                     type="button"
                     onClick={() => setPaymentMethod("qr")}
                     className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${paymentMethod === 'qr' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                   >
                     <QrCode className="w-4 h-4" /> QR Code / Pix
                   </button>
                 </div>

                 <form onSubmit={handleCheckout}>
                   <AnimatePresence mode="wait">
                     
                     {/* CARD FORM */}
                     {paymentMethod === "card" && (
                       <motion.div key="card-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                         <div className="space-y-2">
                           <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Número do Cartão</label>
                           <Input placeholder="0000 0000 0000 0000" required />
                         </div>
                         <div className="space-y-2">
                           <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Titular do Cartão</label>
                           <Input placeholder="NOME IMPRESSO NO CARTÃO" required />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Validade (MM/AA)</label>
                             <Input placeholder="MM/AA" required />
                           </div>
                           <div className="space-y-2">
                             <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">CVV</label>
                             <Input placeholder="123" required type="password" />
                           </div>
                         </div>
                       </motion.div>
                     )}

                     {/* QR CODE GENERATOR */}
                     {paymentMethod === "qr" && (
                       <motion.div key="qr-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center py-4">
                          <div className="bg-white p-4 rounded-xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                             {/* Mock QR Code Pattern */}
                             <div className="w-48 h-48 bg-gray-100 flex items-center justify-center p-2">
                               <div className="w-full h-full border-[8px] border-black flex flex-wrap gap-1 p-2">
                                  {/* Just a visual mockup of QR pixels */}
                                  {Array.from({ length: 64 }).map((_, i) => (
                                    <div key={i} className={`w-3 h-3 ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`}></div>
                                  ))}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                                    <span className="font-bold text-black text-xs">PIX</span>
                                  </div>
                               </div>
                             </div>
                          </div>
                          
                          <div className="w-full max-w-sm space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Copiar código PIX (Copia e Cola)</label>
                            <div className="flex gap-2">
                              <Input disabled value="00020126420014br.gov.bcb.pix0120exemplo@email.com..." className="font-mono text-xs opacity-70" />
                              <Button type="button" onClick={handleCopyQr} variant="outline" className="shrink-0 w-12 border-white/10 hover:bg-white/10">
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-6 text-center max-w-xs">Após o pagamento, sua conta será atualizada automaticamente em alguns instantes.</p>
                       </motion.div>
                     )}

                   </AnimatePresence>

                   <div className="mt-8 pt-6 border-t border-white/10">
                     <Button type="submit" disabled={isLoading || paymentMethod === "qr"} className="w-full h-14 text-base font-semibold bg-white text-black hover:bg-gray-200">
                       {isLoading ? "Processando..." : (paymentMethod === "card" ? "Assinar Agora - R$49/mês" : "Aguardando Pagamento...")}
                     </Button>
                   </div>
                 </form>

               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
