import { ChatsProvider } from "@/contexts/chats-context";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { AppShell } from "@/components/layout/app-shell";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatsProvider>
      <WorkspaceProvider>
        <AppShell>{children}</AppShell>
      </WorkspaceProvider>
    </ChatsProvider>
  );
}
