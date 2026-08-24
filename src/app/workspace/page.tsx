"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Plus,
  Search,
  LayoutTemplate,
  FileText,
  Database,
  Server,
  Trash2,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/contexts/workspace-context";
import { PROJECT_TYPE_LABELS, type ProjectType } from "@/lib/workspace";
import { cn } from "@/lib/utils";

const projectTypeIcons: Record<ProjectType, React.ElementType> = {
  frontend: LayoutTemplate,
  research: Search,
  vision: FileText,
  database: Database,
  api: Server,
};

const projectTypeColors: Record<ProjectType, string> = {
  frontend: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  research: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  vision: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  database: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  api: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function WorkspacePage() {
  const { projects, hydrated, createProject, deleteProject } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ProjectType>("frontend");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name.trim(), type, description.trim());
    setName("");
    setDescription("");
    setType("frontend");
    setIsCreating(false);
  };

  const filtered = projects.filter((p) =>
    [p.name, p.description, PROJECT_TYPE_LABELS[p.type]]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  if (!hydrated) {
    return <div className="h-full w-full bg-[#0a0a0a]" />;
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0a0a0a] text-white custom-scrollbar">
      <div className="relative z-10 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <div className="mb-10">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Workspace
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
            Gerencie seus projetos
          </h1>
          <p className="text-gray-400 max-w-xl">
            Crie workspaces para Frontend, Pesquisas, Documentos de Visão e muito mais. Organize
            tudo em um só lugar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar projetos..."
              className="h-11 pl-10 bg-[#141414] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500/30"
            />
          </div>
          <Button
            type="button"
            onClick={() => setIsCreating(true)}
            className="h-11 px-5 bg-white text-black hover:bg-gray-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo projeto
          </Button>
        </div>

        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-6 rounded-2xl border border-white/10 bg-[#141414]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Criar novo projeto</h2>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Nome
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Landing Page V2"
                      className="h-11 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tipo
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ProjectType)}
                      className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0a0a] text-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                    >
                      {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Descrição
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o objetivo do projeto..."
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] text-white placeholder:text-gray-600 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="h-10 border-white/10 text-gray-300 hover:bg-white/5"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 bg-blue-600 hover:bg-blue-500"
                    disabled={!name.trim()}
                  >
                    Criar projeto
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              {query ? "Nenhum projeto encontrado" : "Nenhum projeto ainda"}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              {query
                ? "Tente ajustar sua busca."
                : "Crie seu primeiro projeto para começar a organizar seus trabalhos."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project, index) => {
              const Icon = projectTypeIcons[project.type];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-5 rounded-2xl border border-white/10 bg-[#141414] hover:bg-[#1a1a1a] hover:border-white/15 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl border flex items-center justify-center",
                        projectTypeColors[project.type]
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border",
                        projectTypeColors[project.type]
                      )}
                    >
                      {PROJECT_TYPE_LABELS[project.type]}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {project.description || "Sem descrição"}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[10px] text-gray-600">
                      {new Date(project.updatedAt).toLocaleDateString("pt-BR")}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => deleteProject(project.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Excluir projeto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Abrir projeto"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
