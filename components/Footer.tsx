// components/Footer.tsx

"use client"

import { usePathname } from "next/navigation"

const Footer = () => {
  const pathname = usePathname()
  
  // Don't show navbar on studio routes
  if (pathname?.startsWith('/studio')) {
    return null
  }
  
  return (
    <h3 className="text-white text-center min-[1800px]:text-xl">
      © 2026 BORNOVAMUN, All Rights Reserved.{" "}
      <br className="sm:hidden" />{" "}
      <a
        href="https://emre-bozkurt.netlify.app"
        target="_blank"
        className="underline cursor-pointer"
      >
        Emre Bozkurt
      </a>
    </h3>
  )
}

export default Footer