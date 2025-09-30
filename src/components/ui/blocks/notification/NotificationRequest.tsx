"use client";
import { supabase } from "@/lib/supabaseClient";
import { useAppSelector } from "@/store/hooks";
import { urlBase64ToUint8Array } from "@/utils/validate/urlBase64ToUint8Array";
import React, { useEffect, useState } from "react";
import { Switch } from "../../shared/switch/switch";

export default function NotificationRequest() {
  const user = useAppSelector((state) => state.user.user);
  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "default"
  >("granted");

  useEffect(() => {
    async function checkNotificationState() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setNotificationPermission("denied");
        return;
      }

      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          setNotificationPermission("granted");
        } else {
          setNotificationPermission(Notification.permission);
        }
      } catch {
        setNotificationPermission("default");
      }
    }
    checkNotificationState();
  }, []);

  const showNotification = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        setNotificationPermission(perm);
        if (perm === "granted") {
          subscribeUser();
        } else {
          console.log("Enable notification");
        }
      });
    } else {
      console.log("This browser does not support notifications.");
    }
  };

  async function subscribeUser() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          generateSubscribeEndPoint(registration);
        } else {
          const reg = await navigator.serviceWorker.register("/sw.js");
          generateSubscribeEndPoint(reg);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const generateSubscribeEndPoint = async (newRegistration: ServiceWorkerRegistration) => {
    const applicationServerKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY!);
    const options = {
      applicationServerKey,
      userVisibleOnly: true,
    };
    const subscription = await newRegistration.pushManager.subscribe(options);

    const { endpoint, keys } = subscription.toJSON();

    const { error } = await supabase.from("subscriptions").insert({
      user_id: user?.id,
      endpoint,
      auth: keys?.auth,
      p256dh: keys?.p256dh,
    });

    if (error) {
      console.log(error.message);
    }
  };

  const removeNotification = async () => {
    setNotificationPermission("denied");

    const { error } = await supabase.from("subscriptions").delete().eq("user_id", user?.id);

    if (error) {
      console.log(error.message);
    }
  };

  return (
    <Switch
      checked={notificationPermission === "granted"}
      onCheckedChange={(checked) => {
        checked ? removeNotification() : showNotification();
      }}
    />
  );
}
