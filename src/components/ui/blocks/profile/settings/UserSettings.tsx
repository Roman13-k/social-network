import React from "react";
import { H2 } from "../../../shared/text/H";
import NotificationRequest from "../../notification/NotificationRequest";
import getUserSettings from "./getUserSettings";
import Setting from "./Setting";

export default function UserSettings() {
  const settings = getUserSettings();

  return (
    <section className='flex flex-col gap-2'>
      <H2>Settings</H2>
      <div className='flex flex-col gap-1'>
        {settings.map((set, i) => (
          <Setting key={i} setting={set} />
        ))}
      </div>
    </section>
  );
}
