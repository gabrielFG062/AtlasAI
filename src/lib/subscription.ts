export type UserPlan = "free" | "pro";

export type SubscriptionStatus = "none" | "active" | "canceled" | "expired";

export type Subscription = {
  plan: UserPlan;
  status: SubscriptionStatus;
  /** Timestamp em que a assinatura Pro foi confirmada. */
  startedAt: number | null;
  /** Próxima renovação (assinatura ativa) ou fim do acesso (assinatura cancelada). */
  renewsAt: number | null;
};

export const SUBSCRIPTION_STORAGE_KEY = "atlas-subscription";

export const PRO_PRICE_LABEL = "R$49/mês";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const FREE_SUBSCRIPTION: Subscription = {
  plan: "free",
  status: "none",
  startedAt: null,
  renewsAt: null,
};

export function createProSubscription(now = Date.now()): Subscription {
  return {
    plan: "pro",
    status: "active",
    startedAt: now,
    renewsAt: now + THIRTY_DAYS_MS,
  };
}

/**
 * O acesso Pro continua válido após o cancelamento até o fim do ciclo já pago.
 */
export function hasProAccess(subscription: Subscription, now = Date.now()): boolean {
  if (subscription.plan !== "pro") return false;
  if (subscription.status === "active") return true;
  if (subscription.status === "canceled") {
    return subscription.renewsAt !== null && subscription.renewsAt > now;
  }
  return false;
}

export function loadSubscription(): Subscription {
  if (typeof window === "undefined") return FREE_SUBSCRIPTION;

  try {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (!raw) return FREE_SUBSCRIPTION;

    const parsed = JSON.parse(raw) as Partial<Subscription>;
    if (parsed?.plan !== "pro") return FREE_SUBSCRIPTION;

    const subscription: Subscription = {
      plan: "pro",
      status: parsed.status ?? "active",
      startedAt: parsed.startedAt ?? null,
      renewsAt: parsed.renewsAt ?? null,
    };

    return hasProAccess(subscription)
      ? subscription
      : { ...subscription, plan: "free", status: "expired" };
  } catch {
    return FREE_SUBSCRIPTION;
  }
}

export function saveSubscription(subscription: Subscription): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));
}

export function formatSubscriptionDate(timestamp: number | null): string {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  none: "Sem assinatura",
  active: "Ativa",
  canceled: "Cancelada",
  expired: "Expirada",
};
