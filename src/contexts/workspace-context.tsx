"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createProject,
  loadProjects,
  saveProjects,
  type Project,
  type ProjectType,
} from "@/lib/workspace";

type WorkspaceContextValue = {
  projects: Project[];
  hydrated: boolean;
  createProject: (name: string, type: ProjectType, description: string) => Project;
  deleteProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  getProjectById: (id: string) => Project | undefined;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProjects(projects);
  }, [projects, hydrated]);

  const create = useCallback((name: string, type: ProjectType, description: string) => {
    const project = createProject(name, type, description);
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: Date.now() } : p
      )
    );
  }, []);

  const getProjectById = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const value = useMemo(
    () => ({
      projects,
      hydrated,
      createProject: create,
      deleteProject,
      updateProject,
      getProjectById,
    }),
    [projects, hydrated, create, deleteProject, updateProject, getProjectById]
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
