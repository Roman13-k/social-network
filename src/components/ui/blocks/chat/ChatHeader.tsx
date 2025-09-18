"use client";
import { ChatInterface } from "@/interfaces/chat";
import { ArrowLeft, CircleUserRound, Pin, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import P from "../../shared/text/P";
import Link from "next/link";
import DeleteDialog from "../../shared/dialog/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteChat } from "@/store/redusers/chatsReduser";
import { useRouter } from "next/navigation";

export default function ChatHeader({ activeChat }: { activeChat: ChatInterface | null }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.chats);
  const handleDelete = async () => {
    if (!activeChat) return;
    await dispatch(deleteChat(activeChat.id));
    if (!error && !loading) router.replace("/chats");
  };

  return (
    <div className='py-4 px-5 bg-white w-full rounded-tr-lg'>
      <div className='flex gap-2 items-center'>
        <Link className='lg:hidden' href={"/chats"}>
          <ArrowLeft color='#657786' />
        </Link>
        <Link href={`/profile/${activeChat?.participants[0].id}`}>
          {activeChat?.participants?.[0]?.avatar_url ? (
            <Image
              className='rounded-full'
              src={activeChat?.participants[0]?.avatar_url}
              alt='avatar'
              width={40}
              height={40}
            />
          ) : (
            <CircleUserRound size={40} />
          )}
        </Link>

        <div>
          <P>{activeChat?.participants[0]?.username}</P>
          <span className='text-text-secondary text-sm'>was online in NaN</span>
        </div>

        <button className='ml-auto cursor-pointer'>
          <Pin />
        </button>

        <DeleteDialog
          handleAction={handleDelete}
          triger={
            <button
              disabled={loading}
              className='lg:ml-5 md:ml-3 ml-1 mr-8 cursor-pointer disabled:opacity-70'>
              <Trash2 color='#ff0000' />
            </button>
          }
          trigerText={"Delete"}
        />
      </div>
    </div>
  );
}
