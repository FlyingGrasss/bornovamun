// components/BackgroundAnimations.tsx

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const BackgroundAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a pool of 20 particles
    const particleCount = 20;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.willChange = "transform, opacity";
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    particlesRef.current = particles;

    const animateParticle = (particle: HTMLDivElement) => {
      // Spawn on edges
      const side = Math.floor(Math.random() * 4);
      let startX, startY;

      switch (side) {
        case 0: // Top
          startX = Math.random() * window.innerWidth;
          startY = -10;
          break;
        case 1: // Right
          startX = window.innerWidth + 10;
          startY = Math.random() * window.innerHeight;
          break;
        case 2: // Bottom
          startX = Math.random() * window.innerWidth;
          startY = window.innerHeight + 10;
          break;
        default: // Left
          startX = -10;
          startY = Math.random() * window.innerHeight;
      }

      gsap.set(particle, {
        x: startX,
        y: startY,
        scale: 1,
        opacity: 0.8,
      });

      // Animate to center and fade (slower duration)
      const endX = window.innerWidth * 0.5 + (Math.random() - 0.5) * 400;
      const endY = window.innerHeight * 0.5 + (Math.random() - 0.5) * 400;

      gsap.to(particle, {
        x: endX,
        y: endY,
        opacity: 0,
        scale: 0.2,
        duration: 10 + Math.random() * 5,
        ease: "power2.out",
        onComplete: () => {
          // Recycle particle
          setTimeout(() => animateParticle(particle), Math.random() * 1000);
        },
      });
    };

    // Start animations with faster staggered delay
    particles.forEach((particle, i) => {
      setTimeout(() => animateParticle(particle), i * 200);
    });

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" />;
};

export default BackgroundAnimations;