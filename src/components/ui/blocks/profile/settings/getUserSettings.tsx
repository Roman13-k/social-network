"use client";
import { SettingsRender } from "@/interfaces/user";
import React from "react";
import NotificationRequest from "../../notification/NotificationRequest";
import { Switch } from "@/components/ui/shared/switch/switch";
import { useTheme } from "next-themes";

export default function getUserSettings() {
  const { setTheme, theme } = useTheme();

  const settings: SettingsRender[] = [
    { label: "User name: ", data: <></> },
    { label: "User avatar: ", data: <></> },
    { label: "Notifications: ", data: <NotificationRequest /> },
    { label: "Chat background: ", data: <></> },
    {
      label: "Dark mode: ",
      data: (
        <Switch
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      ),
    },
  ];

  return settings;
}
