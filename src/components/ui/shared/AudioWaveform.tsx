import React, { useEffect, useRef } from "react";

interface AudioWaveformProps {
  audioUrl: string;
  color: string;
  progress: number;
}

export default function AudioWaveform({ audioUrl, color, progress }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const samples = 200;
  const MIN_HEIGHT = 3;
  const filteredDataRef = useRef<number[]>([]);

  useEffect(() => {
    async function drawAudioWave() {
      const arrayBuffer = await (await fetch(audioUrl)).arrayBuffer();
      const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);

      const rawData = audioBuffer.getChannelData(0);
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData: number[] = [];

      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[i * blockSize + j]);
        }
        filteredData.push(sum / blockSize);
      }

      filteredDataRef.current = normalizeData(filteredData);
      draw(progress);
    }

    drawAudioWave();
  }, [audioUrl]);

  useEffect(() => {
    draw(progress);
  }, [progress]);

  function draw(progress: number) {
    const canvas = canvasRef.current;
    if (!canvas || filteredDataRef.current.length === 0) return;

    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barWidth = width / samples;
    const progressInBars = progress * samples;

    filteredDataRef.current.forEach((value, i) => {
      const barHeight = MIN_HEIGHT + value * (height - MIN_HEIGHT);
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      if (i < Math.floor(progressInBars)) {
        ctx.fillStyle = color;
      } else {
        ctx.fillStyle = `${color}66`;
      }
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    });
  }

  return <canvas style={{ width: "100%" }} ref={canvasRef} width={300} height={25} />;
}

function normalizeData(data: number[]) {
  const max = Math.max(...data);
  return data.map((n) => n / max);
}
