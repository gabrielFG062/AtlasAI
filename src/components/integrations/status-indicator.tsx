"use client";

import { cn } from "@/lib/utils";
import { type IntegrationStatus } from "@/lib/integrations";

const statusConfig: Record<
  IntegrationStatus,
  { label: string; dotColor: string; textColor: string; pulse: boolean }
> = {
  disconnected: {
    label: "Desconectado",
    dotColor: "bg-gray-500",
    textColor: "text-gray-400",
    pulse: false,
  },
  connected: {
    label: "Conectado",
    dotColor: "bg-emerald-400",
    textColor: "text-emerald-400",
    pulse: true,
  },
  syncing: {
    label: "Sincronizando",
    dotColor: "bg-blue-400",
    textColor: "text-blue-400",
    pulse: true,
  },
  error: {
    label: "Erro",
    dotColor: "bg-rose-500",
    textColor: "text-rose-400",
    pulse: false,
  },
};

export function StatusIndicator({ status }: { status: IntegrationStatus }) {
  const config = statusConfig[status];

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.02]">
      <span className="relative flex h-1.5 w-1.5">
        {config.pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-50",
              config.dotColor
            )}
          />
        )}
        <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", config.dotColor)} />
      </span>
      <span className={cn("text-[11px] font-medium tracking-wide", config.textColor)}>
        {config.label}
      </span>
    </div>
  );
}
