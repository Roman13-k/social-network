"use client";
import { useAppSelector } from "@/store/hooks";
import { getUsersChats } from "@/store/redusers/chatsReduser";
import React, { useMemo } from "react";
import useChatsRealTime from "@/hooks/useChatsRealTime";
import ChatElement from "./ChatElement";
import P from "@/components/ui/shared/text/P";
import RenderWithInfinityData from "@/components/ui/layout/RenderWithInfinityData";
import RenderOrError from "@/components/ui/layout/RenderOrError";
import ChatSkeleton from "@/components/ui/shared/skeletons/ChatSkeleton";
import ChatListHeader from "./ChatListHeader";

export default function ChatList() {
  const { chats, error, loading, offset, activeChat } = useAppSelector((state) => state.chats);
  const userId = useAppSelector((state) => state?.user?.user?.id);
  useChatsRealTime(userId);

  const loadChats = () => {
    if (offset === null || !userId) return;

    return getUsersChats({ userId, offset });
  };

  const chatsList = useMemo(
    () =>
      chats.length === 0 && !loading ? (
        <P variant={"secondary"} size={"xs"}>
          You dont have any chats yet
        </P>
      ) : (
        chats.map((chat) => <ChatElement key={chat.id} chat={chat} />)
      ),
    [chats],
  );

  return (
    <aside
      className={`${
        activeChat ? "hidden" : "block w-full"
      } lg:block lg:w-[300px] bg-white rounded-tl-lg min-w-0 shrink-0 px-4 py-5`}>
      <ChatListHeader />
      <RenderWithInfinityData callback={loadChats} loading={loading}>
        <RenderOrError error={error}>
          {chatsList}
          {loading && (
            <>
              <ChatSkeleton />
              <ChatSkeleton />
            </>
          )}
        </RenderOrError>
      </RenderWithInfinityData>
    </aside>
  );
}
