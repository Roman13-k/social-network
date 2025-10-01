import AudioWaveform from "@/components/ui/shared/AudioWaveform";
import { Play } from "lucide-react";
import React from "react";

interface VoiceMessageProps {
  color: string;
  url: string;
}

export default function VoiceMessage({ color, url }: VoiceMessageProps) {
  const handlePlayVoice = () => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className='flex items-center gap-1.5'>
      <button
        onClick={handlePlayVoice}
        style={{
          backgroundColor: `${color}66`,
        }}
        className='rounded-full p-2 cursor-pointer'>
        <Play color={color} size={30} />
      </button>
      <div className='flex flex-col gap-0.5'>
        <AudioWaveform audioUrl={url} color={color} />
        <span></span>
      </div>
    </div>
  );
}
