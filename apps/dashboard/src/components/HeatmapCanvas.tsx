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

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Basic background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid to simulate a page structure
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for(let i=0; i<width; i+=50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for(let i=0; i<height; i+=50) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    // Draw points
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'; // Red with opacity
      ctx.fill();
      
      // Center dot
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.fill();
    });
  }, [points, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="max-w-full block shadow-sm border border-slate-200 z-10 relative"
      style={{
        background: 'transparent'
      }}
    />
  );
}
