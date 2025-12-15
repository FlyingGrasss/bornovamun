// components/BackgroundAnimations.tsx

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CONFIG = {
  PARTICLE_COUNT: 25,
  MIN_SIZE: 0.2,
  MAX_SIZE: 1,
  MIN_DURATION: 12,
  MAX_DURATION: 25,
};

const BackgroundAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const particles: HTMLDivElement[] = [];

    // Initialize particles
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.pointerEvents = "none";
      // Crucial: Set initial opacity to 0 immediately via CSS or JS
      particle.style.opacity = "0";
      container.appendChild(particle);
      particles.push(particle);
    }

    const animateParticle = (particle: HTMLDivElement, isFirstRun: boolean = false) => {
      let startX, startY;

      // Logic to determine start position
      if (isFirstRun) {
        // Randomly scatter on screen
        startX = Math.random() * window.innerWidth;
        startY = Math.random() * window.innerHeight;
      } else {
        // Spawn from random edge
        const side = Math.floor(Math.random() * 4);
        switch (side) {
          case 0: // Top
            startX = Math.random() * window.innerWidth;
            startY = -20;
            break;
          case 1: // Right
            startX = window.innerWidth + 20;
            startY = Math.random() * window.innerHeight;
            break;
          case 2: // Bottom
            startX = Math.random() * window.innerWidth;
            startY = window.innerHeight + 20;
            break;
          default: // Left
            startX = -20;
            startY = Math.random() * window.innerHeight;
        }
      }

      // Immediately set properties to avoid 0,0 glitch
      gsap.set(particle, {
        x: startX,
        y: startY,
        scale: isFirstRun ? Math.random() * 0.5 + 0.5 : 0,
        opacity: 0,
      });

      const endX = window.innerWidth * 0.5 + (Math.random() - 0.5) * 800;
      const endY = window.innerHeight * 0.5 + (Math.random() - 0.5) * 800;
      const duration = CONFIG.MIN_DURATION + Math.random() * (CONFIG.MAX_DURATION - CONFIG.MIN_DURATION);

      const tl = gsap.timeline({
        onComplete: () => animateParticle(particle, false)
      });

      tl.to(particle, {
        opacity: 0.6 + Math.random() * 0.4,
        scale: Math.random() * (CONFIG.MAX_SIZE - CONFIG.MIN_SIZE) + CONFIG.MIN_SIZE,
        duration: 3,
        ease: "power1.inOut"
      }, 0);

      tl.to(particle, {
        x: endX,
        y: endY,
        duration: duration,
        ease: "none",
      }, 0);

      tl.to(particle, {
        opacity: 0,
        scale: 0,
        duration: 4,
        ease: "power2.in"
      }, duration - 4);
    };

    // Stagger start
    particles.forEach((particle, i) => {
      // Use set timeout to space out their entry
      // Use set timeout to space out their entry
      setTimeout(() => animateParticle(particle, true), Math.random() * 100);
    });

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" />;
};

export default BackgroundAnimations;