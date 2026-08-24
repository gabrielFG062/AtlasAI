"use client";

import { motion } from "framer-motion";
import { Plus, FileText, LayoutTemplate, Briefcase, ChevronRight, Telescope, Component, ArrowLeft, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PROJECT_TEMPLATES = [
  {
    id: "frontend",
    title: "Projetos de Frontend",
    description: "Estruturação de bases de código, componentes React, Next.js e Tailwind.",
    icon: <Component className="w-5 h-5 text-blue-400" />,
    color: "bg-blue-500/10 border-blue-500/20",
    emoji: "⚛️"
  },
  {
    id: "research",
    title: "Documentos de Pesquisa",
    description: "Pesquisa centralizada de stack tecnológica, viabilidade técnica e arquitetura.",
    icon: <Telescope className="w-5 h-5 text-purple-400" />,
    color: "bg-purple-500/10 border-purple-500/20",
    emoji: "🔬"
  },
  {
    id: "vision",
    title: "Documentos de Visão",
    description: "Definição de escopo, público-alvo, MVP e roadmap de produto.",
    icon: <FileText className="w-5 h-5 text-emerald-400" />,
    color: "bg-emerald-500/10 border-emerald-500/20",
    emoji: "👁️"
  },
  {
    id: "empty",
    title: "Projeto em Branco",
    description: "Comece do zero com uma folha em branco totalmente customizável.",
    icon: <LayoutTemplate className="w-5 h-5 text-gray-400" />,
    color: "bg-white/5 border-white/10 hover:border-white/20",
    emoji: "📄"
  }
];

export default function WorkspacePage() {
  return (
    <div className="relative flex flex-col h-full w-full overflow-y-auto bg-black custom-scrollbar">
      {/* Subtle Background Glow for harmony with existing aesthetic but kept faint */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] glow-blue blur-[150px] rounded-full opacity-[0.15] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col min-h-full px-6 md:px-12 py-12 md:py-20">
        
        {/* Header (Notion-like clean typography) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💼</span>
              <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Workspace</h1>
            </div>
            <Button className="bg-white text-black hover:bg-gray-200 shadow-lg shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Seu espaço unificado para planejar, arquitetar e documentar. Escolha um tipo de estrutura abaixo para iniciar a mágica.
          </p>
        </motion.div>

        {/* Templates Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16"
        >
          {PROJECT_TEMPLATES.map((item, idx) => (
            <div 
              key={item.id}
              className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:bg-white/[0.03] ${item.color} backdrop-blur-sm`}
            >
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shrink-0 border border-white/5 shadow-inner text-2xl">
                {item.emoji}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-100 flex items-center gap-2 mb-1">
                  {item.title}
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-sm text-gray-400 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Projects List (Mock) */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-gray-400" />
              Projetos Recentes
            </h2>
          </div>
          
          <div className="space-y-1">
            {/* Extremely minimalist Notion list style */}
            {[
              { title: "Arquitetura SaaS Fintech", type: "Documento de Pesquisa", date: "Hoje", emoji: "🔬" },
              { title: "Landing Page AtlasAI", type: "Projetos de Frontend", date: "Ontem", emoji: "⚛️" },
              { title: "Roadmap 2026", type: "Documento de Visão", date: "Semana Passada", emoji: "👁️" }
            ].map((proj, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 truncate">
                     <span className="text-xl shrink-0">{proj.emoji}</span>
                     <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">{proj.title}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                     <span className="text-xs text-gray-500 hidden md:inline-block w-40 text-right">{proj.type}</span>
                     <span className="text-xs text-gray-600 hidden sm:inline-block w-24 text-right">{proj.date}</span>
                     <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Compartilhar">
                           <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Apagar">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
