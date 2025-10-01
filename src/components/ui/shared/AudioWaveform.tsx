import React, { useEffect, useRef } from "react";

export default function AudioWaveform({ audioUrl, color }: { audioUrl: string; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const samples = 100;
  const MIN_HEIGHT = 10;

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

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      const barWidth = width / samples;

      normalizeData(filteredData).forEach((value, i) => {
        const barHeight = MIN_HEIGHT + value * (height - MIN_HEIGHT);
        ctx.fillRect(i * barWidth, (height - barHeight) / 2, barWidth * 0.8, barHeight);
      });
    }
    drawAudioWave();
  }, []);

  return <canvas ref={canvasRef} width={300} height={60} />;
}

function normalizeData(data: number[]) {
  const max = Math.max(...data);
  return data.map((n) => n / max);
}
