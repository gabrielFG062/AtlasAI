export type ProjectType = "frontend" | "research" | "vision" | "database" | "api";

export type Project = {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  createdAt: number;
  updatedAt: number;
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  frontend: "Frontend",
  research: "Pesquisas",
  vision: "Documento de Visão",
  database: "Banco de dados",
  api: "API / Backend",
};

export const PROJECT_STORAGE_KEY = "aura-projects";

export function createProject(
  name: string,
  type: ProjectType,
  description: string
): Project {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name,
    type,
    description,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}
