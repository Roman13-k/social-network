"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch } from "@/store/hooks";
import { messageReceived } from "@/store/redusers/messagesReduser";
import { enterChat, leaveChat } from "@/store/redusers/chatsReduser";

export function useMessagesRealtime(setIsToBottom: (val: boolean) => void, chatId?: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chatId) return;
    dispatch(enterChat(chatId));

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          dispatch(messageReceived(payload.new));
          setIsToBottom(true);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      dispatch(leaveChat());
    };
  }, [chatId, dispatch]);
}
