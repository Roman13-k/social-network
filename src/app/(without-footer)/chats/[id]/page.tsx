import { Metadata } from "next";
import Chat from "@/components/ui/blocks/chat/chat/Chat";
import React from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: chat } = await supabase.from("chats").select("last_message").eq("id", id).single();

  return {
    title: `Chat – Twister`,
    description: chat?.last_message?.content.slice(0, 100) ?? "Chat on Twister.",
  };
}

export default function page() {
  return <Chat />;
}
