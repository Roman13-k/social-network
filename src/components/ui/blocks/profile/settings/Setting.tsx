import { H6 } from "@/components/ui/shared/text/H";
import { SettingsRender } from "@/interfaces/user";
import React from "react";

export default function Setting({ setting }: { setting: SettingsRender }) {
  return (
    <div className='flex gap-1 lg:gap-2 items-center'>
      <H6>{setting.label}</H6>
      {setting.data}
    </div>
  );
}
