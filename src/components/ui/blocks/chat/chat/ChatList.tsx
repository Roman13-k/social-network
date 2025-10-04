"use client";
import { useAppSelector } from "@/store/hooks";
import { getUsersChats } from "@/store/redusers/chatsReduser";
import React, { useEffect, useMemo } from "react";
import P from "../../../shared/text/P";
import ChatSkeleton from "../../../shared/skeletons/ChatSkeleton";
import ChatElement from "./ChatElement";
import RenderWithInfinityData from "../../../layout/RenderWithInfinityData";
import RenderOrError from "../../../layout/RenderOrError";

export default function ChatList() {
  const { chats, error, loading, offset, activeChat } = useAppSelector((state) => state.chats);
  const userId = useAppSelector((state) => state?.user?.user?.id);

  const loadChats = () => {
    if (offset === null || !userId) return;

    return getUsersChats({ userId, offset });
  };

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("all-chats")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "chats", filter: `` },
  //       (payload) => {
  //         console.log("Change received!", payload);
  //       },
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, []);

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
