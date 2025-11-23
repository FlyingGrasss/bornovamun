// app/template.tsx

"use client"

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Skip first render (like Framer Motion does)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(containerRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Kill any existing animations
    gsap.killTweensOf(containerRef.current);
    
    // Page transition animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.4,
        ease: "power2.out", // Close to cubic-bezier(0.25, 0.1, 0.25, 1.0)
        delay: 0.05 // Small delay for smoother feel
      }
    );
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="relative z-10"
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}