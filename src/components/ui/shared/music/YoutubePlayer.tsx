"use client";
import React, { useRef, useState } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";

const playlist = [
  { id: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up" },
  { id: "9bZkp7q19f0", title: "PSY – Gangnam Style" },
  { id: "3JZ_D3ELwOQ", title: "Eminem – Without Me" },
];

export default function YouTubeMusicPlayer() {
  const [current, setCurrent] = useState(0);
  const playerRef = useRef<null | YouTubePlayer.Player>(null);

  const opts = {
    height: "0",
    width: "0",
    playerVars: { autoplay: 0, controls: 0 },
  };

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
  };

  const play = () => playerRef.current?.playVideo();
  const pause = () => playerRef.current?.pauseVideo();

  const next = () => {
    const nextIndex = (current + 1) % playlist.length;
    setCurrent(nextIndex);
    playerRef.current?.loadVideoById(playlist[nextIndex].id);
  };

  const prev = () => {
    const prevIndex = (current - 1 + playlist.length) % playlist.length;
    setCurrent(prevIndex);
    playerRef.current?.loadVideoById(playlist[prevIndex].id);
  };

  return (
    <div className='flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-2xl text-white w-fit'>
      <YouTube videoId={playlist[current].id} opts={opts} onReady={onReady} />
      <h2 className='text-lg font-semibold'>{playlist[current].title}</h2>
      <div className='flex gap-3'>
        <button onClick={prev} className='px-3 py-1 bg-gray-700 rounded cursor-pointer'>
          ⏮ Prev
        </button>
        <button onClick={play} className='px-3 py-1 bg-green-500 rounded cursor-pointer'>
          ▶ Play
        </button>
        <button onClick={pause} className='px-3 py-1 bg-red-500 rounded cursor-pointer'>
          ⏸ Pause
        </button>
        <button onClick={next} className='px-3 py-1 bg-gray-700 rounded cursor-pointer'>
          ⏭ Next
        </button>
      </div>
    </div>
  );
}
