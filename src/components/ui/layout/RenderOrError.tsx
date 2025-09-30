import { ErrorState } from "@/interfaces";
import React, { PropsWithChildren } from "react";
import P from "../shared/text/P";

export default function RenderOrError({
  children,
  error,
}: PropsWithChildren<{ error: ErrorState | null }>) {
  if (error) return <P variant={"error"}>{error.message}</P>;

  return <>{children}</>;
}
