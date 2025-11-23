// app/page.tsx

import Link from "next/link";
import Countdown from "@/components/Countdown";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <main className="relative z-10 justify-center min-h-[85vh] flex flex-col items-center gap-12 max-sm:gap-6 px-4">
        <div className="text-center">
          <h1 className="text-[hsl(42,72%,52%)] text-7xl max-sm:text-[40px] tracking-tight font-bold mb-4">
            BORNOVAMUN&apos;26
          </h1>
          <p className="text-white text-2xl max-sm:text-lg mb-2">
            16-17-18 Ocak 2026
          </p>
        </div>

        <div className="max-sm:scale-90 max-sm:origin-center">
          <Countdown />
        </div>

        <Link href="/apply" className="w-fit">
          <button className="group glassmorphism text-xl max-sm:text-base cursor-pointer items-center transition-all duration-300 justify-center gap-4 max-sm:gap-2 inline-flex backdrop-blur-md rounded-full px-8 py-4 max-sm:px-6 max-sm:py-3 shadow-lg">
            Apply Now
            <svg
              width="24"
              height="19"
              viewBox="0 0 24 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:translate-x-2 max-sm:w-[15px]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.7105 0.439344C14.1953 1.02511 14.1953 1.97487 14.7105 2.56064L19.4951 7.99997H1.56946C0.840735 7.99997 0.25 8.67155 0.25 9.49997C0.25 10.3284 0.840735 11 1.56946 11H19.4951L14.7105 16.4392C14.1953 17.0251 14.1953 17.9749 14.7105 18.5606C15.2258 19.1465 16.0614 19.1465 16.5765 18.5606L23.6136 10.5606C24.1288 9.97473 24.1288 9.02509 23.6136 8.43932L16.5765 0.439344C16.0614 -0.146448 15.2258 -0.146448 14.7105 0.439344Z"
                className="fill-white group-hover:fill-[hsl(42,72%,52%)] transition-colors duration-300"
              />
            </svg>
          </button>
        </Link>
      </main>
    </div>
  );
}