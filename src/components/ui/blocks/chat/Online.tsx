"use client";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUserOnline } from "@/store/redusers/chatsReduser";
import React, { useEffect } from "react";

export default function Online() {
  const userId = useAppSelector((state) => state?.user?.user?.id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel(`online`, {
      config: { presence: { key: userId } },
    });

    channel.on("presence", { event: "sync" }, () => {
      dispatch(updateUserOnline(channel.presenceState()));
      console.log(channel.presenceState());
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ online_at: new Date().toISOString() });
      }
    });

    const handleBeforeUnload = async () => {
      await supabase
        .from("profiles")
        .update({ online_at: new Date().toISOString() })
        .eq("id", userId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      channel.unsubscribe();
    };
  }, [userId]);

  return <></>;
}
