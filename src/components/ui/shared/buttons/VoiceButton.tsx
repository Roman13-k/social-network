import { supabase } from "@/lib/supabaseClient";
import { useAppSelector } from "@/store/hooks";
import { stopwatchTimeFormat } from "@/utils/dates/stopwatchTimeFormat";
import { Mic, Pause, Send } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef } from "react";

interface VoiceButtonProps {
  className?: string;
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  time: number;
}

export default function VoiceButton({ className, isActive, setIsActive, time }: VoiceButtonProps) {
  const user = useAppSelector((state) => state.user.user);
  const activeChat = useAppSelector((state) => state.chats.activeChat);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const handleRecording = async () => {
    if (isActive) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start();
    setIsActive(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsActive(false);
    }
  };

  const handleSendRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/ogg; codecs=opus" });
      const fileName = `voice_${Date.now()}.ogg`;

      const { error: uploadError } = await supabase.storage
        .from("voices")
        .upload(fileName, audioBlob);
      if (uploadError) return console.error(uploadError);

      const { data } = supabase.storage.from("voices").getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("messages").insert({
        audio_url: data.publicUrl,
        sender_id: user?.id,
        chat_id: activeChat?.id,
      });

      if (insertError) console.error(insertError);
    };
    mediaRecorderRef.current.stop();
    setIsActive(false);
  };

  return (
    <div className={`${className ?? ""} flex justify-center items-center gap-2`}>
      {isActive && <span>{stopwatchTimeFormat(time)}</span>}
      {isActive ? (
        <>
          <button
            onClick={handleStopRecording}
            className='p-1.5 rounded-full cursor-pointer bg-red-400'>
            <Pause size={30} color='#fb2c36' />
          </button>

          <button
            className='p-1.5 rounded-full cursor-pointer bg-accent/30'
            onClick={handleSendRecording}>
            <Send color='#1da1f2' size={30} />
          </button>
        </>
      ) : (
        <button
          className='p-1.5 rounded-full cursor-pointer bg-accent/30'
          onClick={handleRecording}>
          <Mic color='#1da1f2' size={30} />
        </button>
      )}
    </div>
  );
}
