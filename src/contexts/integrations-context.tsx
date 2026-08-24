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
  INTEGRATIONS,
  INTEGRATION_STORAGE_KEY,
  loadIntegrations,
  saveIntegrations,
  type AdPlatform,
  type Integration,
  type IntegrationStatus,
} from "@/lib/integrations";

type IntegrationsContextValue = {
  integrations: Integration[];
  hydrated: boolean;
  connect: (id: AdPlatform, accountName: string) => void;
  disconnect: (id: AdPlatform) => void;
  sync: (id: AdPlatform) => void;
  setError: (id: AdPlatform) => void;
  getById: (id: AdPlatform) => Integration | undefined;
};

const IntegrationsContext = createContext<IntegrationsContextValue | null>(null);

export function IntegrationsProvider({ children }: { children: React.ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIntegrations(loadIntegrations());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveIntegrations(integrations);
  }, [integrations, hydrated]);

  const updateIntegration = useCallback(
    (id: AdPlatform, patch: Partial<Integration> | ((prev: Integration) => Integration)) => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id
            ? typeof patch === "function"
              ? patch(item)
              : { ...item, ...patch }
            : item
        )
      );
    },
    []
  );

  const connect = useCallback(
    (id: AdPlatform, accountName: string) => {
      updateIntegration(id, {
        status: "connected",
        accountName,
        lastSyncedAt: Date.now(),
      });
    },
    [updateIntegration]
  );

  const disconnect = useCallback(
    (id: AdPlatform) => {
      updateIntegration(id, {
        status: "disconnected",
        accountName: undefined,
        lastSyncedAt: undefined,
      });
    },
    [updateIntegration]
  );

  const sync = useCallback(
    (id: AdPlatform) => {
      updateIntegration(id, (prev) => ({ ...prev, status: "syncing" }));
      setTimeout(() => {
        updateIntegration(id, {
          status: "connected",
          lastSyncedAt: Date.now(),
        });
      }, 1500);
    },
    [updateIntegration]
  );

  const setError = useCallback(
    (id: AdPlatform) => {
      updateIntegration(id, { status: "error" });
    },
    [updateIntegration]
  );

  const getById = useCallback(
    (id: AdPlatform) => integrations.find((i) => i.id === id),
    [integrations]
  );

  const value = useMemo(
    () => ({ integrations, hydrated, connect, disconnect, sync, setError, getById }),
    [integrations, hydrated, connect, disconnect, sync, setError, getById]
  );

  return (
    <IntegrationsContext.Provider value={value}>{children}</IntegrationsContext.Provider>
  );
}

export function useIntegrations() {
  const ctx = useContext(IntegrationsContext);
  if (!ctx) throw new Error("useIntegrations must be used within IntegrationsProvider");
  return ctx;
}
