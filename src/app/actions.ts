"use server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.NEXT_PUBLIC_VAPID_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export const sendNotification = async (
  message: string,
  user_id: string,
  title: string,
  url: string,
) => {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("endpoint, auth, p256dh")
    .eq("user_id", user_id)
    .single();

  if (error) {
    return JSON.stringify({ error: error.message });
  } else if (data) {
    try {
      await webpush.sendNotification(
        {
          endpoint: data.endpoint,
          keys: {
            auth: data.auth,
            p256dh: data.p256dh,
          },
        },
        JSON.stringify({
          title: title,
          body: message,
          url,
        }),
      );
      return "{}";
    } catch (e) {
      return JSON.stringify({ error: "failed to send notification" });
    }
  }
  return "{}";
};
