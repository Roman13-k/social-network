"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        "peer data-[state=checked]:bg-accent data-[state=unchecked]:bg-background-primary border border-accent inline-flex h-[1.4rem] w-12 shrink-0 items-center rounded-full shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300",
        className,
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          "data-[state=checked]:bg-background-primary data-[state=unchecked]:bg-accent pointer-events-none block size-4 rounded-full ring-0 transition-all duration-300 ease-in-out data-[state=checked]:translate-x-[1.9rem] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
