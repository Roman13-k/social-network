import { SettingsRender } from "@/interfaces/user";
import React from "react";
import NotificationRequest from "../../notification/NotificationRequest";

export default function getUserSettings() {
  const settings: SettingsRender[] = [
    { label: "User name", data: <></> },
    { label: "User avatar", data: <></> },
    { label: "Notifications", data: <NotificationRequest /> },
    { label: "Chat background", data: <></> },
    { label: "Dark mode", data: <></> },
  ];

  return settings;
}
