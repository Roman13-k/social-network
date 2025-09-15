import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const paragraphVariants = cva("leading-[110%]", {
  variants: {
    variant: {
      default: "text-text-primary",
      error: "text-red-500",
      secondary: "text-text-secondary",
    },
    size: {
      xs: "text-[14px]",
      default: "min-md:text-[16px] text-[15px] font-normal",
      lg: "min-lg:text-[18px] min-sm:text-[16px] text-[14px] font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export default function P({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof paragraphVariants>) {
  return (
    <p className={cn(paragraphVariants({ className, variant, size }))} {...props}>
      {children}
    </p>
  );
}
