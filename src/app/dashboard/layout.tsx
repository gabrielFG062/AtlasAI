import { ChatsProvider } from "@/contexts/chats-context";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatsProvider>
      <AppShell>{children}</AppShell>
    </ChatsProvider>
  );
}
