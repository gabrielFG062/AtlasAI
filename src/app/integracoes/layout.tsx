import { ChatsProvider } from "@/contexts/chats-context";
import { IntegrationsProvider } from "@/contexts/integrations-context";
import { AppShell } from "@/components/layout/app-shell";

export default function IntegracoesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatsProvider>
      <IntegrationsProvider>
        <AppShell>{children}</AppShell>
      </IntegrationsProvider>
    </ChatsProvider>
  );
}
