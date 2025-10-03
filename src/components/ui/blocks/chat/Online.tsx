"use client";
import { supabase } from "@/lib/supabaseClient";
import { useAppSelector } from "@/store/hooks";
import React, { useEffect } from "react";

export default function Online() {
  const userId = useAppSelector((state) => state?.user?.user?.id);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel(`online`, {
      config: { presence: { key: userId } },
    });

    channel.on("presence", { event: "sync" }, () => {
      console.log("Кто в онлайне:", channel.presenceState());
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ online_at: new Date().toISOString() });
      }
    });
  }, [userId]);

  return <></>;
}
