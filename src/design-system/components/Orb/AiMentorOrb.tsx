import React, { useEffect, useRef } from 'react';
import { OrbitalTrajectories } from './OrbitalTrajectories';

export type OrbState = 'Idle' | 'Listening' | 'Thinking' | 'Speaking';

export interface AiMentorOrbProps {
  state?: OrbState;
  size?: number;
  showOrbits?: boolean;
  className?: string;
}

export const AiMentorOrb: React.FC<AiMentorOrbProps> = ({
  state = 'Idle',
  size = 320,
  showOrbits = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += state === 'Thinking' ? 0.035 : state === 'Listening' ? 0.025 : 0.015;
      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.36;

      // 1. Outer Cosmic Ambient Halo Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.3,
        centerX,
        centerY,
        size / 2
      );

      let glowColor1 = 'rgba(124, 58, 237, 0.45)';
      let glowColor2 = 'rgba(59, 130, 246, 0.25)';

      if (state === 'Thinking') {
        glowColor1 = 'rgba(168, 85, 247, 0.6)';
        glowColor2 = 'rgba(99, 102, 241, 0.4)';
      } else if (state === 'Listening') {
        glowColor1 = 'rgba(99, 102, 241, 0.55)';
        glowColor2 = 'rgba(56, 189, 248, 0.35)';
      }

      glowGrad.addColorStop(0, glowColor1);
      glowGrad.addColorStop(0.55, glowColor2);
      glowGrad.addColorStop(1, 'rgba(4, 4, 10, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Main Crystal Sphere Core (Multi-pass Photorealistic Gradient)
      const coreGrad = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.38,
        radius * 0.05,
        centerX,
        centerY,
        radius
      );

      coreGrad.addColorStop(0, '#F3E8FF'); // Specular highlight
      coreGrad.addColorStop(0.15, '#C084FC'); // High Lavender
      coreGrad.addColorStop(0.4, '#7C3AED'); // Rich Electric Violet
      coreGrad.addColorStop(0.75, '#1E1B4B'); // Deep Indigo Body
      coreGrad.addColorStop(1, '#0B081A'); // Rim Edge Shadow

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();
      ctx.clip();

      // 3. Inner Bioluminescent Contour Waves (Matching reference)
      ctx.lineWidth = 1.2;
      const speed = state === 'Thinking' ? 2.2 : state === 'Listening' ? 1.6 : 1.0;

      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        const yBase = centerY + i * (radius / 3.6);
        ctx.strokeStyle = `rgba(224, 231, 255, ${0.35 - Math.abs(i) * 0.04})`;

        for (let x = centerX - radius; x <= centerX + radius; x += 3) {
          const dx = Math.abs(x - centerX);
          const distNorm = Math.max(0, 1 - dx / radius);
          const wave =
            Math.sin(x * 0.035 + time * speed + i * 0.7) * 12 * Math.pow(distNorm, 1.2);

          if (x === centerX - radius) {
            ctx.moveTo(x, yBase + wave);
          } else {
            ctx.lineTo(x, yBase + wave);
          }
        }
        ctx.stroke();
      }

      // 4. Subtle Internal Shimmer Particles
      for (let p = 0; p < 12; p++) {
        const px = centerX + Math.sin(time + p * 1.6) * (radius * 0.6);
        const py = centerY + Math.cos(time * 0.7 + p) * (radius * 0.6);
        const pSize = (Math.sin(time * 2 + p) + 1.4) * 1.1;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 5. Outer Electric Glow Rim Ring
      const pulse = Math.sin(time * 2) * 2.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 2 + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, size]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Orbital Trajectory SVG Line Layer */}
      {showOrbits && <OrbitalTrajectories size={size * 1.3} />}

      {/* Main Canvas Shader */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="relative z-10 block pointer-events-none drop-shadow-[0_0_35px_rgba(124,58,237,0.5)]"
      />
    </div>
  );
};
