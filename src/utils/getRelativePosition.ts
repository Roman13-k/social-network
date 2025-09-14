import { PositionInterface } from "@/interfaces";
import { RefObject } from "react";

export function getRelativePosition(
  e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ref: RefObject<HTMLDivElement | null>,
): PositionInterface {
  if (!ref.current) return { x: 0, y: 0 };
  const rect = ref.current.getBoundingClientRect();

  if ("clientX" in e) {
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  } else {
    const touch = e.changedTouches[0];
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }
}
