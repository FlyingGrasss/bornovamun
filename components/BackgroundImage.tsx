// components/BackgroundImage.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation'

export default function BackgroundImage() {

  const pathname = usePathname();
  
  // Don't show navbar on studio routes
  if (pathname?.startsWith('/studio')) {
    return null;
  }
    
  return (
    <div 
      className="fixed top-0 left-0 w-full z-[-1] overflow-hidden"
      style={{ height: '900px' }}
    >
      <Image
        src={"/trees.jpg"}
        alt="Tree background"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
        quality={90}
      />
      
      <div className="absolute inset-0 bg-[#0A1938]/90" />

    </div>
  );
}