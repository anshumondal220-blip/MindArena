'use client';

import React, { useRef, useState, useEffect } from 'react';
import { soundEngine } from '@/lib/audio';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScratchpadModal({ isOpen, onClose }: ScratchpadModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#4edea3');

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-surface-container rounded-2xl border border-surface-container-highest shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-container-highest bg-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px]">stylus_note</span>
            <span className="font-headline-md text-sm font-bold text-on-surface">
              Aptitude Scratchpad
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {['#4edea3', '#c0c1ff', '#ffb95f', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => setPenColor(color)}
                  className={`w-5 h-5 rounded-full border ${
                    penColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={clearCanvas}
              className="text-xs font-label-code text-on-surface-variant hover:text-white px-2 py-1 rounded bg-surface-container"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-bright text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div className="relative w-full h-72 bg-[#090c13] flex items-center justify-center touch-none">
          <canvas
            ref={canvasRef}
            width={380}
            height={280}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair"
          />
          <span className="absolute bottom-2 right-2 font-label-code text-[10px] text-outline/50 pointer-events-none">
            Draw calculations here
          </span>
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-high flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-headline-md text-xs font-bold active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
