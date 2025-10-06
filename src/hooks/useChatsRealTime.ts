"use client";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch } from "@/store/hooks";
import { updateLastMessageChat } from "@/store/redusers/chatsReduser";
import { useEffect } from "react";

export default function useChatsRealTime(userId?: string) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!userId) return;

    const chatsChannel = supabase
      .channel("chats")
      .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, (payload) => {
        dispatch(updateLastMessageChat(payload));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatsChannel);
    };
  }, [userId]);
}
