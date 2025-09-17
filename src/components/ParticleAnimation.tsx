import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  initialY: number;
}

const rainbowColors = [
  'hsl(0, 75%, 85%)',    // 红
  'hsl(30, 75%, 85%)',   // 橙
  'hsl(60, 75%, 85%)',   // 黄
  'hsl(120, 75%, 85%)',  // 绿
  'hsl(210, 75%, 85%)',  // 蓝
  'hsl(240, 75%, 85%)',  // 靛
  'hsl(270, 75%, 85%)'   // 紫
];

export default function ParticleAnimation({ particleCount = 100 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles with rainbow colors
    particles.current = Array.from({ length: particleCount }, () => {
      const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3.6 + 1.2, // 增大20%
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: color,
        initialY: Math.random() * canvas.height
      };
    });

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Update and draw particles
      particles.current.forEach((p) => {
        // Update position with floating effect
        const floatOffset = Math.sin(time * 2 + p.initialY * 0.01) * 5; // 上下浮动5px
        p.x += p.speedX;
        p.y = p.initialY + floatOffset;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.initialY = Math.random() * canvas.height;

        // Draw particle with white stroke
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('85%)', '85%, 0.8)'); // 保持透明度0.8
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
}
