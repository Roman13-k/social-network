import ChatDefault from "@/components/ui/blocks/chat/chat/ChatDefault";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Chats – Twister",
  description: "Stay connected with friends and manage your conversations on Twister.",
};

export default function page() {
  return <ChatDefault />;
}
