import { H5 } from "@/components/ui/shared/text/H";
import { SettingsRender } from "@/interfaces/user";
import React from "react";

export default function Setting({ setting }: { setting: SettingsRender }) {
  return (
    <div className='flex gap-2 items-center'>
      <H5>{setting.label}</H5>
      {setting.data}
    </div>
  );
}
