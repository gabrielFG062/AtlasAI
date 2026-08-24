"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sparkles, User, ArrowDown, RefreshCw, AlertTriangle, ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ChatComposer } from "@/components/chat/chat-composer";
import { useSubscription } from "@/contexts/subscription-context";
import type { ChatCategoryId } from "@/lib/chat-categories";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  category?: ChatCategoryId;
  gaData?: {
    traffic: {
      value: string;
      change: string;
      isNegative: boolean;
      previous: string;
      current: string;
      sparkline: number[];
    };
    conversion: {
      previous: string;
      current: string;
      change: string;
      isNegative: boolean;
      sparkline: number[];
    };
    impactPage: {
      name: string;
      metricName: string;
      previous: string;
      current: string;
      change: string;
      isNegative: boolean;
    };
    discoveries: string[];
    recommendations: string[];
  };
};

type ChatScreenProps = {
  heading?: string;
  initialCategory?: ChatCategoryId;
};

export function ChatScreen({
  heading = "Como posso ajudar hoje?",
  initialCategory,
}: ChatScreenProps) {
  const [category, setCategory] = useState<ChatCategoryId>(initialCategory ?? "nano-banana-lite");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsAIWriting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isPro } = useSubscription();

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsgId = crypto.randomUUID();
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    
    const userMessage: Message = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: now,
      category
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAIWriting(true);

    // Simulate AI response based on the user's query
    setTimeout(() => {
      const aiMsgId = crypto.randomUUID();
      const aiTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      
      const lowerText = text.toLowerCase();
      let aiMessage: Message;

      if (lowerText.includes("venda") || lowerText.includes("cair") || lowerText.includes("queda") || lowerText.includes("google") || lowerText.includes("analytics")) {
        // High-fidelity Google Analytics response
        aiMessage = {
          id: aiMsgId,
          role: "assistant",
          timestamp: aiTime,
          content: "Analisando seus dados do Google Analytics, identifiquei alguns fatores principais que contribuíram para a queda nas vendas esta semana em comparação com a semana anterior.",
          gaData: {
            traffic: {
              value: "-18%",
              change: "-18%",
              isNegative: true,
              previous: "12.5K",
              current: "10.2K Sessões",
              sparkline: [45, 42, 38, 32, 35, 29, 24]
            },
            conversion: {
              previous: "2.8%",
              current: "1.9%",
              change: "-0.9 pp",
              isNegative: true,
              sparkline: [35, 33, 30, 28, 25, 22, 19]
            },
            impactPage: {
              name: "Checkout Page",
              metricName: "Taxa de abandono aumentou",
              previous: "32%",
              current: "47%",
              change: "+15pp",
              isNegative: true
            },
            discoveries: [
              "Queda no tráfego orgânico (-21%) e em campanhas pagas (-15%), com destaque para redução no Google Ads.",
              "A taxa de conversão caiu de 2.8% para 1.9%, indicando que menos visitantes estão completando a compra.",
              "A página de checkout apresentou aumento significativo na taxa de abandono (+15pp).",
              "Usuários de dispositivos móveis tiveram maior dificuldade na finalização da compra."
            ],
            recommendations: [
              "Verifique campanhas de aquisição e orçamento.",
              "Revise a usabilidade e performance da página de checkout.",
              "Considere simplificar o fluxo de pagamento em dispositivos móveis."
            ]
          }
        };
      } else {
        // Standard high-fidelity assistant response
        aiMessage = {
          id: aiMsgId,
          role: "assistant",
          timestamp: aiTime,
          content: `Entendi perfeitamente sua dúvida sobre "${text}". Como seu Agente de IA analítico conectado ao Google Analytics, posso cruzar os dados de tráfego, conversão e comportamento para te dar um diagnóstico preciso. Experimente perguntar algo como "Por que minhas vendas caíram essa semana?" para ver uma análise profunda de funil.`
        };
      }

      setMessages((prev) => [...prev, aiMessage]);
      setIsAIWriting(false);
    }, 2200);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-black selection:bg-blue-500/30 font-sans">
      {/* Ambient Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-indigo-950/15 blur-[140px] rounded-full opacity-70 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-purple-950/10 blur-[130px] rounded-full opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-[800px] bg-blue-950/5 blur-[150px] rounded-full opacity-40 pointer-events-none" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Header */}
      <header className="relative flex items-center justify-end p-4 border-b border-white/[0.04] bg-black/40 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/settings"
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.04]"
            title="Configurações"
          >
            <Settings className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          {isPro ? (
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold h-9 px-4 py-2 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 border border-indigo-500/25 text-indigo-300">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-400" strokeWidth={1.5} />
              Plano Pro
            </span>
          ) : (
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold h-9 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:via-indigo-500 hover:to-indigo-600 text-white transition-all duration-300 active:scale-[0.98] shadow-[0_0_20px_rgba(79,70,229,0.25)] hover:shadow-[0_0_25px_rgba(79,70,229,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Sparkles className="w-4 h-4 mr-2 text-indigo-200" strokeWidth={1.5} />
              Fazer Upgrade
            </Link>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-3xl flex-1 flex flex-col px-4 py-6 md:py-10">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              // Empty State
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col items-center justify-center text-center my-auto py-12"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150" />
                  <div className="relative w-16 h-16 rounded-2xl border border-white/10 bg-[#0c0c0c] flex items-center justify-center shadow-2xl">
                    <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-2xl py-2">
                  {heading}
                </h1>
                
                <p className="text-gray-400 text-sm max-w-md mt-2 leading-relaxed">
                  Faça perguntas complexas sobre seus dados de e-commerce, tráfego e conversões direto do Google Analytics.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-10">
                  <button
                    onClick={() => handleSendMessage("Por que minhas vendas caíram essa semana?")}
                    className="flex flex-col items-start text-left p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 group"
                  >
                    <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">Análise de Vendas</span>
                    <span className="text-[11px] text-gray-400 mt-1 leading-normal">"Por que minhas vendas caíram essa semana?"</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("Como está a performance do tráfego orgânico?")}
                    className="flex flex-col items-start text-left p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 group"
                  >
                    <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">Tráfego Orgânico</span>
                    <span className="text-[11px] text-gray-400 mt-1 leading-normal">"Como está a performance do tráfego orgânico?"</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              // Message List
              <div className="flex-1 space-y-8">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {/* User Message */}
                    {msg.role === "user" && (
                      <div className="flex items-start gap-3 max-w-[85%]">
                        <div className="flex flex-col items-end">
                          <div className="rounded-2xl px-4 py-2.5 bg-white/[0.04] border border-white/10 text-sm text-gray-100 leading-relaxed shadow-sm">
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1.5 mr-1">{msg.timestamp}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
                        </div>
                      </div>
                    )}

                    {/* AI Message */}
                    {msg.role === "assistant" && (
                      <div className="flex items-start gap-4 w-full">
                        <div className="w-8 h-8 rounded-full bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                          <Sparkles className="w-4 h-4 text-indigo-400" strokeWidth={1.5} />
                        </div>

                        <div className="flex-1 flex flex-col items-start min-w-0">
                          <div className="text-sm text-gray-200 leading-relaxed max-w-prose">
                            {msg.content}
                          </div>

                          {/* Google Analytics Interactive Cards */}
                          {msg.gaData && (
                            <div className="w-full mt-6 space-y-6">
                              {/* Metrics Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Traffic Card */}
                                <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#121212]/50 backdrop-blur-xl p-4 flex flex-col justify-between h-36">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs text-gray-400 font-medium">Tráfego</span>
                                      <div className="w-4 h-4 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center cursor-help group/tooltip">
                                        <span className="text-[9px] text-gray-500 font-bold">i</span>
                                        <div className="absolute bottom-full left-4 mb-2 hidden group-hover/tooltip:block z-50 bg-[#0c0c0c] border border-white/10 text-[10px] text-gray-300 p-2 rounded-lg w-48 shadow-2xl">
                                          Sessões totais de usuários no site esta semana.
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                                      <ArrowDown className="w-3.5 h-3.5 text-red-400" strokeWidth={1.5} />
                                    </div>
                                  </div>

                                  <div className="my-2">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-2xl font-bold tracking-tight text-red-400">{msg.gaData.traffic.value}</span>
                                      <span className="text-[11px] text-gray-500">{msg.gaData.traffic.previous} → {msg.gaData.traffic.current.split(" ")[0]}</span>
                                    </div>
                                  </div>

                                  {/* Sparkline */}
                                  <div className="h-8 w-full mt-auto">
                                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                                      <defs>
                                        <linearGradient id="redGlow" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="rgba(248,113,113,0.2)" />
                                          <stop offset="100%" stopColor="rgba(248,113,113,0)" />
                                        </linearGradient>
                                      </defs>
                                      <path
                                        d={`M 0 ${msg.gaData.traffic.sparkline[0]} L 16 ${msg.gaData.traffic.sparkline[1]} L 32 ${msg.gaData.traffic.sparkline[2]} L 48 ${msg.gaData.traffic.sparkline[3]} L 64 ${msg.gaData.traffic.sparkline[4]} L 80 ${msg.gaData.traffic.sparkline[5]} L 100 ${msg.gaData.traffic.sparkline[6]}`}
                                        fill="none"
                                        stroke="rgba(248,113,113,0.6)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d={`M 0 ${msg.gaData.traffic.sparkline[0]} L 16 ${msg.gaData.traffic.sparkline[1]} L 32 ${msg.gaData.traffic.sparkline[2]} L 48 ${msg.gaData.traffic.sparkline[3]} L 64 ${msg.gaData.traffic.sparkline[4]} L 80 ${msg.gaData.traffic.sparkline[5]} L 100 ${msg.gaData.traffic.sparkline[6]} L 100 30 L 0 30 Z`}
                                        fill="url(#redGlow)"
                                      />
                                    </svg>
                                  </div>
                                </div>

                                {/* Conversion Rate Card */}
                                <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#121212]/50 backdrop-blur-xl p-4 flex flex-col justify-between h-36">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs text-gray-400 font-medium">Taxa de Conversão</span>
                                      <div className="w-4 h-4 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center cursor-help group/tooltip">
                                        <span className="text-[9px] text-gray-500 font-bold">i</span>
                                        <div className="absolute bottom-full left-4 mb-2 hidden group-hover/tooltip:block z-50 bg-[#0c0c0c] border border-white/10 text-[10px] text-gray-300 p-2 rounded-lg w-48 shadow-2xl">
                                          Porcentagem de sessões que resultaram em compra.
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/15 flex items-center justify-center">
                                      <RefreshCw className="w-3.5 h-3.5 text-purple-400" strokeWidth={1.5} />
                                    </div>
                                  </div>

                                  <div className="my-2">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-2xl font-bold tracking-tight text-purple-400">{msg.gaData.conversion.previous} → {msg.gaData.conversion.current}</span>
                                      <span className="text-[11px] text-gray-500">{msg.gaData.conversion.change}</span>
                                    </div>
                                  </div>

                                  {/* Sparkline */}
                                  <div className="h-8 w-full mt-auto">
                                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                                      <defs>
                                        <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="rgba(168,85,247,0.2)" />
                                          <stop offset="100%" stopColor="rgba(168,85,247,0)" />
                                        </linearGradient>
                                      </defs>
                                      <path
                                        d={`M 0 ${msg.gaData.conversion.sparkline[0]} L 16 ${msg.gaData.conversion.sparkline[1]} L 32 ${msg.gaData.conversion.sparkline[2]} L 48 ${msg.gaData.conversion.sparkline[3]} L 64 ${msg.gaData.conversion.sparkline[4]} L 80 ${msg.gaData.conversion.sparkline[5]} L 100 ${msg.gaData.conversion.sparkline[6]}`}
                                        fill="none"
                                        stroke="rgba(168,85,247,0.6)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d={`M 0 ${msg.gaData.conversion.sparkline[0]} L 16 ${msg.gaData.conversion.sparkline[1]} L 32 ${msg.gaData.conversion.sparkline[2]} L 48 ${msg.gaData.conversion.sparkline[3]} L 64 ${msg.gaData.conversion.sparkline[4]} L 80 ${msg.gaData.conversion.sparkline[5]} L 100 ${msg.gaData.conversion.sparkline[6]} L 100 30 L 0 30 Z`}
                                        fill="url(#purpleGlow)"
                                      />
                                    </svg>
                                  </div>
                                </div>

                                {/* Impact Page Card */}
                                <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#121212]/50 backdrop-blur-xl p-4 flex flex-col justify-between h-36">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs text-gray-400 font-medium">Página com maior impacto</span>
                                      <div className="w-4 h-4 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center cursor-help group/tooltip">
                                        <span className="text-[9px] text-gray-500 font-bold">i</span>
                                        <div className="absolute bottom-full right-4 mb-2 hidden group-hover/tooltip:block z-50 bg-[#0c0c0c] border border-white/10 text-[10px] text-gray-300 p-2 rounded-lg w-48 shadow-2xl">
                                          Página que apresentou a maior variação negativa de métricas.
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/15 flex items-center justify-center">
                                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" strokeWidth={1.5} />
                                    </div>
                                  </div>

                                  <div className="my-1">
                                    <span className="text-sm font-semibold text-white block truncate">{msg.gaData.impactPage.name}</span>
                                    <span className="text-[10px] text-gray-500 block mt-0.5">{msg.gaData.impactPage.metricName}</span>
                                  </div>

                                  <div className="mt-auto pt-1 flex items-baseline gap-2 border-t border-white/[0.04]">
                                    <span className="text-base font-bold text-rose-400">{msg.gaData.impactPage.previous} → {msg.gaData.impactPage.current}</span>
                                    <span className="text-[10px] text-rose-400/80 font-medium">({msg.gaData.impactPage.change})</span>
                                  </div>
                                </div>
                              </div>

                              {/* Discoveries and Recommendations */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Discoveries */}
                                <div className="rounded-xl border border-white/5 bg-[#0c0c0c]/40 p-5">
                                  <h4 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    Principais descobertas
                                  </h4>
                                  <ul className="space-y-3">
                                    {msg.gaData.discoveries.map((disc, idx) => (
                                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                                        <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" strokeWidth={2} />
                                        <span>{disc}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Recommendations */}
                                <div className="rounded-xl border border-white/5 bg-[#0c0c0c]/40 p-5">
                                  <h4 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Recomendações
                                  </h4>
                                  <ul className="space-y-3">
                                    {msg.gaData.recommendations.map((rec, idx) => (
                                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2} />
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          <span className="text-[10px] text-gray-500 mt-3.5 ml-1">{msg.timestamp}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* AI Writing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4 w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1.5 py-1">
                      <span className="text-xs text-gray-400 font-medium">Analisando dados do Google Analytics...</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Composer Container */}
      <div className="p-4 md:p-8 w-full max-w-3xl mx-auto shrink-0 z-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ChatComposer category={category} onCategoryChange={setCategory} onSendMessage={handleSendMessage} />
        </motion.div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-600">
            AtlasAI pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
