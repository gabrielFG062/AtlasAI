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
  loadIntegrations,
  saveIntegrations,
  type AdPlatform,
  type Integration,
} from "@/lib/integrations";
import { api, getAuthToken, type AdPlatformBackend } from "@/lib/api";

type IntegrationsContextValue = {
  integrations: Integration[];
  hydrated: boolean;
  connect: (id: AdPlatform, accountName: string) => Promise<void>;
  disconnect: (id: AdPlatform) => Promise<void>;
  sync: (id: AdPlatform) => void;
  setError: (id: AdPlatform) => void;
  getById: (id: AdPlatform) => Integration | undefined;
};

function toBackendPlatform(id: AdPlatform): AdPlatformBackend | null {
  switch (id) {
    case "meta":
      return "meta_ads";
    case "google":
      return "google_ads";
    case "tiktok":
      return "tiktok_ads";
    default:
      return null;
  }
}

function fromBackendPlatform(id: AdPlatformBackend): AdPlatform | null {
  switch (id) {
    case "meta_ads":
      return "meta";
    case "google_ads":
      return "google";
    case "tiktok_ads":
      return "tiktok";
    default:
      return null;
  }
}

const IntegrationsContext = createContext<IntegrationsContextValue | null>(null);

export function IntegrationsProvider({ children }: { children: React.ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [hydrated, setHydrated] = useState(false);
  const [backendAccountIds, setBackendAccountIds] = useState<Record<AdPlatform, number | null>>({
    meta: null,
    instagram: null,
    google: null,
    tiktok: null,
  });

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

  useEffect(() => {
    let isMounted = true;
    const token = getAuthToken();
    if (token) {
      Promise.allSettled([
        api.listAdAccounts(),
        api.getInstagramStatus(),
      ]).then(([accountsRes, igRes]) => {
        if (!isMounted) return;
        const newIds: Record<AdPlatform, number | null> = { meta: null, instagram: null, google: null, tiktok: null };
        const accounts = accountsRes.status === "fulfilled" ? accountsRes.value : [];
        const igData = igRes.status === "fulfilled" ? igRes.value : null;

        setIntegrations((current) => {
          return current.map((item) => {
            if (item.id === "instagram") {
              if (igData && igData.connected) {
                return {
                  ...item,
                  status: "connected",
                  accountName: igData.username || "Conta Instagram",
                  accountHandle: igData.username ? `@${igData.username}` : undefined,
                  avatarUrl: igData.profile_picture_url || undefined,
                  lastSyncedAt: igData.created_at ? new Date(igData.created_at).getTime() : Date.now(),
                };
              } else {
                return {
                  ...item,
                  status: "disconnected",
                  accountName: undefined,
                  accountHandle: undefined,
                  avatarUrl: undefined,
                  lastSyncedAt: undefined,
                };
              }
            }

            const matched = accounts.find((a) => fromBackendPlatform(a.platform) === item.id);
            if (matched) {
              newIds[item.id] = matched.id;
              return {
                ...item,
                status: matched.status === "active" ? "connected" : matched.status === "revoked" ? "disconnected" : "error",
                accountName: matched.external_account_id,
                lastSyncedAt: new Date(matched.connected_at).getTime(),
              };
            }
            return item;
          });
        });

        setBackendAccountIds(newIds);
        setHydrated(true);
      });
    } else {
      setIntegrations(loadIntegrations());
      setHydrated(true);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) saveIntegrations(integrations);
  }, [integrations, hydrated]);

  const connect = useCallback(
    async (id: AdPlatform, accountName: string) => {
      const token = getAuthToken();
      const backendPlatform = toBackendPlatform(id);
      if (token && backendPlatform) {
        try {
          const created = await api.createAdAccount({
            platform: backendPlatform,
            external_account_id: accountName,
            access_token: "auth_token_session",
          });
          setBackendAccountIds((prev) => ({ ...prev, [id]: created.id }));
          updateIntegration(id, {
            status: "connected",
            accountName: created.external_account_id,
            lastSyncedAt: new Date(created.connected_at).getTime(),
          });
          return;
        } catch (err) {
          console.error("Falha ao salvar conta de anúncio no backend:", err);
          updateIntegration(id, { status: "error" });
          throw err;
        }
      }

      updateIntegration(id, {
        status: "connected",
        accountName,
        accountHandle: id === "instagram" ? "@atlas.ai" : undefined,
        lastSyncedAt: Date.now(),
      });
    },
    [updateIntegration]
  );

  const disconnect = useCallback(
    async (id: AdPlatform) => {
      const token = getAuthToken();
      if (id === "instagram") {
        if (token) {
          try {
            await api.disconnectInstagram();
          } catch (err) {
            console.error("Falha ao desconectar Instagram no backend:", err);
          }
        }
        updateIntegration("instagram", {
          status: "disconnected",
          accountName: undefined,
          accountHandle: undefined,
          avatarUrl: undefined,
          lastSyncedAt: undefined,
        });
        return;
      }

      const backendId = backendAccountIds[id];
      if (token && backendId) {
        try {
          await api.deleteAdAccount(backendId);
          setBackendAccountIds((prev) => ({ ...prev, [id]: null }));
        } catch (err) {
          console.error("Falha ao remover conta no backend:", err);
        }
      }

      updateIntegration(id, {
        status: "disconnected",
        accountName: undefined,
        lastSyncedAt: undefined,
      });
    },
    [backendAccountIds, updateIntegration]
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
