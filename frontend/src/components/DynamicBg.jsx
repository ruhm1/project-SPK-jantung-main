import { useEffect, useRef, useCallback } from 'react';

const DynamicBg = () => {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 80;
    const mouse = mousePosRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Enhanced medical-futuristic theme
    const medicalHues = [
      { h: 0, s: 80, l: 55 },   // Heartbeat red
      { h: 160, s: 75, l: 40 }, // ECG green  
      { h: 200, s: 85, l: 50 }, // Clinical cyan
      { h: 280, s: 65, l: 45 }, // Medical purple
      { h: 340, s: 70, l: 60 }  // Vital pink
    ];

    // Particles array
    for (let i = 0; i < particleCount; i++) {
      const hueData = medicalHues[Math.floor(Math.random() * medicalHues.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 4 + 1.5,
        alpha: Math.random() * 0.5 + 0.2,
        hue: hueData.h,
        sat: hueData.s,
        light: hueData.l,
        pulsePhase: Math.random() * Math.PI * 2,
        trail: [], // Particle trail
        isECG: Math.random() > 0.6,
        wavePhase: Math.random() * Math.PI * 2,
        connectionDist: 120 + Math.random() * 60
      });
    }

    const animate = () => {
      // Futuristic medical gradient background
      const gradientBg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradientBg.addColorStop(0, '#0a0e1a');
      gradientBg.addColorStop(0.3, 'rgba(6, 20, 35, 0.98)');
      gradientBg.addColorStop(0.7, 'rgba(15, 41, 68, 0.98)');
      gradientBg.addColorStop(1, '#0a0e1a');
      
      ctx.fillStyle = gradientBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid overlay
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update & draw particles with trails
      particles.forEach((p, i) => {
        // Store trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 20) p.trail.shift();

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015;

        // Boundary
        if (p.x < 0 || p.x > canvas.width) p.vx *= -0.9;
        if (p.y < 0 || p.y > canvas.height) {
          p.vy *= -0.7;
          p.y = Math.max(0, Math.min(canvas.height, p.y));
        }

        // Mouse interaction (futuristic scanner)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          p.vx += (dx / dist) * 0.5;
          p.vy += (dy / dist) * 0.5;
          p.alpha = Math.min(0.9, p.alpha + 0.05);
        }

        // Heartbeat
        p.pulsePhase += 0.1;
        p.radius = 2 + Math.sin(p.pulsePhase) * 1.2;

        // ECG wave
        if (p.isECG) {
          p.wavePhase += 0.15;
          p.vy -= Math.sin(p.wavePhase) * 0.1;
        }

        // Connections (reduced - performance)
        if (Math.random() < 0.3) {
          particles.slice(i+1, i+5).forEach((p2) => {
            const pdist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (pdist < 100) {
              ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });
        }

        // Particle glow trail
        if (p.trail.length > 12) p.trail.shift();
        p.trail.forEach((point, i) => {
          const trailAlpha = p.alpha * (i / p.trail.length);
          const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 4);
          gradient.addColorStop(0, `hsla(${p.hue}, 80%, 55%, ${trailAlpha})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.save();
          ctx.shadowColor = `hsla(${p.hue}, 80%, 55%, 0.8)`;
          ctx.shadowBlur = 10 + i * 0.5;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Main particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        gradient.addColorStop(0, `hsla(${p.hue}, 85%, 60%, ${p.alpha})`);
        gradient.addColorStop(0.6, `hsla(${p.hue}, 80%, 55%, ${p.alpha * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.shadowColor = `hsla(${p.hue}, 85%, 60%, 1)`;
        ctx.shadowBlur = 20;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Dynamic ECG scan lines
      const time = Date.now() * 0.001;
      for (let i = 0; i < 3; i++) {
        const y = 100 + i * canvas.height / 4;
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += 20) {
          const wave = Math.sin((x * 0.01) + time + i) * 8;
          ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }

      // Holographic scan line
      const scanY = (time * 50) % canvas.height;
      const scanGradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      scanGradient.addColorStop(0, 'transparent');
      scanGradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.1)');
      scanGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.3)');
      scanGradient.addColorStop(0.6, 'rgba(16, 185, 129, 0.1)');
      scanGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 2, canvas.width, 4);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    mousePosRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      onMouseMove={handleMouseMove}
    />
  );
};

export default DynamicBg;

