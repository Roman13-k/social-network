import AudioWaveform from "@/components/ui/shared/AudioWaveform";
import { minSecFormat } from "@/utils/dates/minSecFormat";
import { Play, Pause } from "lucide-react";
import React, { MouseEvent, useEffect, useRef, useState } from "react";

interface VoiceMessageProps {
  color: string;
  url: string;
}

export default function VoiceMessage({ color, url }: VoiceMessageProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  let rafId: number;

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onplay = () => {
      const tick = () => {
        setCurrentTime(audio.currentTime);
        rafId = requestAnimationFrame(tick);
      };
      tick();
    };
    audio.onended = () => {
      cancelAnimationFrame(rafId);
      setIsPlaying(false);
    };
    audio.onpause = () => cancelAnimationFrame(rafId);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [url]);

  const togglePlay = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className='flex flex-col gap-1.5 w-full'>
      <div className='flex items-center gap-2'>
        <button
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onClick={togglePlay}
          style={{ backgroundColor: `${color}66` }}
          className='rounded-full p-2 cursor-pointer'>
          {isPlaying ? <Pause color={color} size={30} /> : <Play color={color} size={30} />}
        </button>
        <div className='flex flex-col items-start'>
          <AudioWaveform progress={currentTime / duration} audioUrl={url} color={color} />
          <span className='text-sm text-text-secondary'>
            {isPlaying ? minSecFormat(currentTime) : minSecFormat(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
