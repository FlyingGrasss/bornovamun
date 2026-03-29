// components/Countdown.tsx

"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const targetDate = new Date("2026-04-24T00:00:00").getTime();

  // 1. Initialize with a "safe" default state that will be the same on Server and Client
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 2. Track if the component has mounted
  const [isMounted, setIsMounted] = useState(false);

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  useEffect(() => {
    // 3. Set the initial time and mark as mounted once we are on the client
    setIsMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white text-[#0A1938] rounded-lg px-6 py-4 min-w-[100px] max-sm:min-w-20 max-sm:px-4 max-sm:py-3 shadow-lg">
        <span className="text-5xl max-sm:text-4xl font-bold tabular-nums">
          {/* 4. Use a fallback (00) until the client has taken over */}
          {!isMounted ? "00" : value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-white text-lg max-sm:text-base mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-4 max-sm:gap-2 justify-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default Countdown;