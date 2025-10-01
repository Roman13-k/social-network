"use client";
import { useEffect, useRef, useState } from "react";

export default function useStopwatch(stopwatch: number = 10) {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const startRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      startRef.current = Date.now() - time;
      interval = setInterval(() => {
        setTime(Date.now() - startRef.current);
      }, stopwatch);
    }

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (!isActive) setTime(0);
  }, [isActive]);

  return { setIsActive, isActive, time };
}
