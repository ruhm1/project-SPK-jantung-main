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
    const particleCount = 120;
    const mouse = mousePosRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Medical theme colors: red(heartbeat), green(safe), blue(clinical), subtle purple
    const medicalHues = [
      { h: 0, s: 70, l: 60 },   // Red heartbeat
      { h: 160, s: 70, l: 45 }, // Green safe
      { h: 210, s: 80, l: 55 }, // Blue clinical
      { h: 280, s: 60, l: 50 }  // Purple medical
    ];

    // Create particles with medical theme
    for (let i = 0; i < particleCount; i++) {
      const hueData = medicalHues[Math.floor(Math.random() * medicalHues.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 1,
        baseAlpha: Math.random() * 0.4 + 0.3,
        alpha: Math.random() * 0.4 + 0.3,
        hue: hueData.h,
        sat: hueData.s,
        light: hueData.l,
        pulsePhase: Math.random() * Math.PI * 2, // For heartbeat effect
        isECG: Math.random() > 0.7, // 30% ECG wave particles
        waveOffset: Math.random() * 100
      });
    }

    const animate = () => {
      // Dark medical background with subtle clinical gradient
      const gradientBg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradientBg.addColorStop(0, 'rgba(15, 23, 42, 0.95)');  // Dark slate
      gradientBg.addColorStop(0.5, 'rgba(30, 41, 59, 0.98)'); // Clinical blue-gray
      gradientBg.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      ctx.fillStyle = gradientBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // Physics with gentle medical float
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // Gentle gravity for organic feel

        // Boundary bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -0.8;
        if (p.y < 0 || p.y > canvas.height) {
          p.vy *= -0.6;
          p.y = p.y < 0 ? 0 : canvas.height;
        }

        // Mouse attraction (doctor's cursor interaction)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += dx / dist * 0.3;
          p.vy += dy / dist * 0.3;
        }

        // Heartbeat pulse effect
        p.pulsePhase += 0.08;
        const pulse = Math.sin(p.pulsePhase) * 0.3 + 1;
        p.radius = (p.radius * 0.98) + (1.5 * pulse * 0.02); // Gentle breathing

        // ECG wave effect for special particles
        if (p.isECG) {
          p.waveOffset += 2;
          p.alpha = 0.6 + Math.sin(p.waveOffset * 0.1) * 0.2;
        }

        // Color variation
        p.hue = (p.hue + 0.2) % 360;
        p.light += (50 + Math.sin(Date.now() * 0.001 + p.x) * 5 - p.light) * 0.05;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${p.alpha})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, ${p.sat-20}%, ${p.light+10}%, ${p.alpha * 0.6})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.shadowColor = `hsla(${p.hue}, ${p.sat}%, 50%, 0.8)`;
        ctx.shadowBlur = 15;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw subtle ECG lines occasionally
      if (Math.random() < 0.1) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(100 + Math.random() * (canvas.width - 200), canvas.height * 0.7);
        for (let i = 0; i < 10; i++) {
          ctx.lineTo(100 + i * 50 + Math.sin(i) * 20, canvas.height * 0.7 + Math.sin(i * 0.5) * 15);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
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

