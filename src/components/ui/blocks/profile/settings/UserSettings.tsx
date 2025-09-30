import React from "react";
import { H2 } from "../../../shared/text/H";
import Setting from "./Setting";
import GetUserSettings from "./getUserSettings";

export default function UserSettings() {
  const settings = GetUserSettings();

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
