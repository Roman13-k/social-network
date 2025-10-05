"use client";
import { ChatInterface } from "@/interfaces/chat";
import { ArrowLeft, Pin, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteChat } from "@/store/redusers/chatsReduser";
import { useRouter } from "next/navigation";
import { closePinned, openPinned } from "@/store/redusers/messagesReduser";
import P from "@/components/ui/shared/text/P";
import DeleteDialog from "@/components/ui/shared/dialog/DeleteDialog";
import UserAvarWithOnline from "@/components/ui/shared/UserAvarWithOnline";
import { chatDateFormat } from "@/utils/dates/chatDateFormat";

export default function ChatHeader({ activeChat }: { activeChat: ChatInterface | null }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.chats);
  const { isPinnedModal, pinnedMessages } = useAppSelector((state) => state.messages);

  const handleDelete = async () => {
    if (!activeChat) return;
    await dispatch(deleteChat(activeChat.id));
    if (!error && !loading) router.replace("/chats");
  };

  return (
    <div className='py-2 md:py-4 px-3 md:px-5 h-[79px] bg-white w-full rounded-tr-lg z-1'>
      <div className='flex gap-2 items-center h-full w-full'>
        {isPinnedModal ? (
          <div className='flex gap-3'>
            <button className='cursor-pointer' onClick={() => dispatch(closePinned())}>
              <ArrowLeft color='#657786' />
            </button>
            <P>{pinnedMessages.total_count} Pinned Messages</P>
          </div>
        ) : (
          <Link className='lg:hidden' href={"/chats"}>
            <ArrowLeft color='#657786' />
          </Link>
        )}

        {!isPinnedModal && (
          <>
            <Link href={`/profile/${activeChat?.participants[0].id}`}>
              <UserAvarWithOnline user={activeChat?.participants[0]} />
            </Link>

            <div>
              <P>{activeChat?.participants[0]?.username}</P>
              <span
                className={`${
                  activeChat?.participants[0].isOnline ? "text-button" : "text-text-secondary"
                }  text-sm`}>
                {activeChat?.participants[0].isOnline
                  ? "online"
                  : activeChat?.participants[0].online_at
                  ? "was online at " + chatDateFormat(activeChat?.participants[0].online_at)
                  : "been online for a long time"}
              </span>
            </div>

            <button onClick={() => dispatch(openPinned())} className='ml-auto cursor-pointer'>
              <Pin />
            </button>
          </>
        )}
        <DeleteDialog
          handleAction={handleDelete}
          triger={
            <button
              disabled={loading}
              className={`${
                isPinnedModal ? "ml-auto" : "lg:ml-5 md:ml-3 ml-1"
              } mr-8 cursor-pointer disabled:opacity-70`}>
              <Trash2 color='#ff0000' />
            </button>
          }
          trigerText={"Delete"}
        />
      </div>
    </div>
  );
}
