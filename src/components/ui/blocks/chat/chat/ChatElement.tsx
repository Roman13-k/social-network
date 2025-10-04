"use client";
import { ChatInterface } from "@/interfaces/chat";
import Link from "next/link";
import React from "react";
import { useAppSelector } from "@/store/hooks";
import P from "@/components/ui/shared/text/P";
import UserAvarWithOnline from "@/components/ui/shared/UserAvarWithOnline";

export default function ChatElement({ chat }: { chat: ChatInterface }) {
  const curChat = useAppSelector((state) => state.chats.activeChat);

  return (
    <Link
      className={`border-border border rounded-md px-3 py-2 hover:bg-background-secondary ${
        curChat?.id === chat.id ? "bg-background-secondary" : "bg-background-primary"
      } w-full transition-colors`}
      href={`/chats/${chat.id}`}>
      <div className='flex gap-2 items-center'>
        <UserAvarWithOnline user={chat.participants[0]} />

        <div className='flex flex-col gap-1 flex-1 min-w-0'>
          <P>{chat?.participants[0]?.username}</P>
          <P className='truncate' variant='secondary' size='xs'>
            {chat.lastMessage?.content
              ? chat.lastMessage?.content
              : chat.lastMessage?.audio_url
              ? "Voice message"
              : "Send first message"}
          </P>
        </div>
      </div>
    </Link>
  );
}
