import React, { useEffect, useRef } from 'react';

export interface WaveformVisualizerProps {
  isActive?: boolean;
  barCount?: number;
  height?: number;
  width?: number;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive = true,
  barCount = 32,
  height = 48,
  width = 320,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let step = 0;

    const render = () => {
      step += 0.08;
      ctx.clearRect(0, 0, width, height);

      const barWidth = 3;
      const gap = (width - barCount * barWidth) / (barCount - 1);

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        // Calculate dynamic height using sine waves simulating audio frequency spectrum
        let barHeight = 4;
        if (isActive) {
          const amplitude = Math.sin(step + i * 0.3) * 0.5 + 0.5;
          const centerFactor = 1 - Math.abs(i - barCount / 2) / (barCount / 2);
          barHeight = Math.max(4, amplitude * (height * 0.85) * centerFactor);
        }

        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#b89cff');
        gradient.addColorStop(1, '#7048e8');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, barCount, height, width]);

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
