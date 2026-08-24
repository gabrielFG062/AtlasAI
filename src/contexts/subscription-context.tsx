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
  createProSubscription,
  FREE_SUBSCRIPTION,
  hasProAccess,
  loadSubscription,
  saveSubscription,
  type Subscription,
} from "@/lib/subscription";

type SubscriptionContextValue = {
  subscription: Subscription;
  hydrated: boolean;
  isPro: boolean;
  /** Chamado quando o pagamento da assinatura é confirmado. */
  activatePro: () => void;
  /** Mantém o acesso Pro até o fim do ciclo já pago. */
  cancelSubscription: () => void;
  resumeSubscription: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription>(FREE_SUBSCRIPTION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSubscription(loadSubscription());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveSubscription(subscription);
  }, [subscription, hydrated]);

  const activatePro = useCallback(() => {
    setSubscription(createProSubscription());
  }, []);

  const cancelSubscription = useCallback(() => {
    setSubscription((prev) =>
      prev.plan === "pro" ? { ...prev, status: "canceled" } : prev
    );
  }, []);

  const resumeSubscription = useCallback(() => {
    setSubscription((prev) =>
      prev.plan === "pro" ? { ...prev, status: "active" } : prev
    );
  }, []);

  const value = useMemo(
    () => ({
      subscription,
      hydrated,
      isPro: hasProAccess(subscription),
      activatePro,
      cancelSubscription,
      resumeSubscription,
    }),
    [subscription, hydrated, activatePro, cancelSubscription, resumeSubscription]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
