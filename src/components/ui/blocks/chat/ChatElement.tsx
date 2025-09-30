"use client";
import { ChatInterface } from "@/interfaces/chat";
import Link from "next/link";
import React from "react";
import P from "../../shared/text/P";
import { useAppSelector } from "@/store/hooks";
import UserAvatar from "../../shared/UserAvatar";

export default function ChatElement({ chat }: { chat: ChatInterface }) {
  const curChat = useAppSelector((state) => state.chats.activeChat);

  return (
    <Link
      className={`border-border border rounded-md px-3 py-2 hover:bg-background-secondary ${
        curChat?.id === chat.id ? "bg-background-secondary" : "bg-background-primary"
      } w-full transition-colors`}
      href={`/chats/${chat.id}`}>
      <div className='flex gap-2 items-center'>
        <UserAvatar href={chat?.participants?.[0]?.avatar_url} size={40} className='rounded-full' />
        <div className='flex flex-col gap-1 flex-1 min-w-0'>
          <P>{chat?.participants[0]?.username}</P>
          <P className='truncate' variant='secondary' size='xs'>
            {chat.lastMessage?.content ?? "Send first message"}
          </P>
        </div>
      </div>
    </Link>
  );
}
