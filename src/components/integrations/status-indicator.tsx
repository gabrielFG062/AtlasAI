"use client";

import { cn } from "@/lib/utils";
import { type IntegrationStatus } from "@/lib/integrations";

const statusConfig: Record<
  IntegrationStatus,
  { label: string; color: string; pulse: boolean }
> = {
  disconnected: {
    label: "Desconectado",
    color: "bg-gray-500",
    pulse: false,
  },
  connected: {
    label: "Conectado",
    color: "bg-[#C8F04A]",
    pulse: true,
  },
  syncing: {
    label: "Sincronizando",
    color: "bg-blue-400",
    pulse: true,
  },
  error: {
    label: "Erro",
    color: "bg-red-500",
    pulse: false,
  },
};

export function StatusIndicator({ status }: { status: IntegrationStatus }) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-40",
              config.color
            )}
          />
        )}
        <span className={cn("relative inline-flex rounded-full h-2 w-2", config.color)} />
      </span>
      <span className="text-xs font-medium text-gray-400">{config.label}</span>
    </div>
  );
}
