import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ResultAnimation({ result }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  const riskColor = result?.risk === 'Low' ? '#10b981' : '#dc2626';
  const isHighRisk = result?.risk === 'High';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId;
    let time = 0;
    let particles = [];

    const createParticles = () => {
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 4 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          life: 1.0
        });
      }
    };

    const drawHeart = (x, y, size, pulse) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size * pulse, size * pulse * 0.9);
      ctx.fillStyle = riskColor;
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowColor = riskColor;
      ctx.shadowBlur = 50;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.bezierCurveTo(-size * 0.6, -size * 0.8, -size * 1.2, -size * 0.2, -size * 0.8, size * 0.2);
      ctx.bezierCurveTo(-size * 0.4, size * 0.6, 0, size * 0.8, 0, size * 0.8);
      ctx.bezierCurveTo(size * 0.4, size * 0.6, size * 0.8, size * 0.2, size * 0.8, size * 0.2);
      ctx.bezierCurveTo(size * 1.2, -size * 0.2, size * 0.6, -size * 0.8, 0, -size * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;
      const pulse = 1 + Math.sin(time * 3) * 0.3;
      const glowPulse = 1 + Math.sin(time * 2) * 0.2;

      // Background gradient
      const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height));
      gradient.addColorStop(0, riskColor + 'CC');
      gradient.addColorStop(0.5, riskColor + '66');
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Large central heart
      drawHeart(canvas.width/2, canvas.height/2 - 50, 120, pulse * glowPulse);

      // Particles
      particles.forEach((p, i) => {
        ctx.save();
        ctx.globalAlpha = p.opacity * p.life;
        ctx.fillStyle = riskColor;
        ctx.shadowColor = riskColor;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;
        if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            life: 1.0
          };
        }
      });

      // Multiple pulsing hearts
      for (let i = 0; i < 5; i++) {
        const offsetX = (canvas.width/2) + Math.sin(time + i) * 200;
        const offsetY = (canvas.height/2) + Math.cos(time * 0.7 + i) * 150;
        const smallPulse = 1 + Math.sin(time * 4 + i) * 0.4;
        drawHeart(offsetX, offsetY, 25, smallPulse);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [riskColor]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-10 text-center pointer-events-auto space-y-6 backdrop-blur-xl">
        <motion.div 
          className={`text-6xl md:text-8xl font-black drop-shadow-2xl ${isHighRisk ? 'text-red-400/90' : 'text-green-400/90'}`}
          animate={{ scale: [1, 1.1, 1], textShadow: ['0 0 20px currentColor', '0 0 40px currentColor', '0 0 20px currentColor'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {result?.risk}
        </motion.div>
        <motion.div 
          className="text-2xl md:text-3xl font-bold bg-black/50 px-8 py-6 rounded-2xl backdrop-blur-xl border-2 border-white/20"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Risiko: {Math.round(result?.probability?.low * 100 || 0)}% Low | {Math.round(result?.probability?.high * 100 || 0)}% High
        </motion.div>
        <motion.p 
          className="text-xl md:text-2xl font-semibold bg-black/70 px-12 py-8 rounded-2xl backdrop-blur-xl border max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {result?.advice || 'Konsultasikan dengan dokter untuk hasil lebih akurat.'}
        </motion.p>
      </div>
    </motion.div>
  );
}
