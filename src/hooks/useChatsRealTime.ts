"use client";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch } from "@/store/hooks";
import { updateChats } from "@/store/redusers/chatsReduser";
import { useEffect } from "react";

export default function useChatsRealTime(userId?: string) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!userId) return;

    const chatsChannel = supabase
      .channel("chats")
      .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, (payload) => {
        dispatch(updateChats(payload));
      })
      .subscribe();

    const participantsChannel = supabase
      .channel("chat_participants")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_participants",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("User chat participation changed:", payload);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatsChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [userId]);
}
