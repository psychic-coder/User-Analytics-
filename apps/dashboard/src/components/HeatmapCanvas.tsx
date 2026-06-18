import { useEffect, useRef } from 'react';
import { HeatmapData } from '../types';

interface Props {
  points: HeatmapData[];
  width: number;
  height: number;
}

export default function HeatmapCanvas({ points, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'lighter';

    points.forEach((point) => {
      const radius = 30;
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );
      
      gradient.addColorStop(0, 'rgba(255, 200, 0, 0.8)');
      gradient.addColorStop(0.3, 'rgba(239, 68, 68, 0.5)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';

  }, [points, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="max-w-full block z-10 absolute inset-0 pointer-events-none"
      style={{
        background: 'transparent'
      }}
    />
  );
}
