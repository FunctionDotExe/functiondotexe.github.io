"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerRef.current.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Create particles
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      radius: number;
    }> = [];

    const particleCount = 3000;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 500,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 1,
        radius: Math.random() * 1.5,
      });
    }

    let scrollProgress = 0;
    scrollY.onChange((v) => {
      scrollProgress = Math.min(v / 500, 1);
    });

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "rgba(14, 13, 11, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(242, 235, 217, 0.6)";

      for (const particle of particles) {
        // Converge particles on scroll
        const convergeFactor = scrollProgress * 0.3;
        particle.x *= 1 - convergeFactor * 0.01;
        particle.y *= 1 - convergeFactor * 0.01;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z -= particle.vz;

        // Wrap around
        if (particle.z < 1) {
          particle.z = 500;
        }

        // Draw particle
        const scale = particle.z / 500;
        const screenX = canvas.width / 2 + particle.x * scale;
        const screenY = canvas.height / 2 + particle.y * scale;

        ctx.globalAlpha = scale * (1 - scrollProgress * 0.3);
        ctx.beginPath();
        ctx.arc(screenX, screenY, particle.radius * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (containerRef.current?.contains(canvas)) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, [scrollY]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
