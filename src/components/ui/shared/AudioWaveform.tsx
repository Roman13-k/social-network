import React, { useEffect, useRef } from "react";

interface AudioWaveformProps {
  audioUrl: string;
  color: string;
  progress: number; // от 0 до 1
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
    // Вычисляем точный прогресс в терминах количества столбиков
    const progressInBars = progress * samples;

    filteredDataRef.current.forEach((value, i) => {
      const barHeight = MIN_HEIGHT + value * (height - MIN_HEIGHT);
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      // Полностью закрашенные столбики (прогресс прошел полностью этот столбик)
      if (i < Math.floor(progressInBars)) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
      }
      // Текущий частично закрашенный столбик
      else if (i === Math.floor(progressInBars)) {
        const partialProgress = progressInBars - i;

        // Фоновая (прозрачная) часть
        ctx.fillStyle = `${color}66`;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);

        // Закрашенная часть поверх
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth * 0.8 * partialProgress, barHeight);
      }
      // Еще не затронутые столбики
      else {
        ctx.fillStyle = `${color}66`;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
      }
    });
  }

  return <canvas ref={canvasRef} width={300} height={25} />;
}

function normalizeData(data: number[]) {
  const max = Math.max(...data);
  return data.map((n) => n / max);
}
