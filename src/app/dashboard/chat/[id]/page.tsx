"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatScreen } from "@/components/chat/chat-screen";
import { useChats } from "@/contexts/chats-context";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getChatById, hydrated } = useChats();
  const chat = getChatById(id);

  useEffect(() => {
    if (hydrated && !chat) {
      router.replace("/dashboard");
    }
  }, [hydrated, chat, router]);

  if (!hydrated || !chat) {
    return <div className="h-full w-full bg-black" />;
  }

  const heading =
    chat.title === "Nova conversa" ? "Como posso ajudar hoje?" : chat.title;

  return <ChatScreen chatId={id} heading={heading} />;
}
