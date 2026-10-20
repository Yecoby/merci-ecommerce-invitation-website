"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface Props {
  targetDate: string; // ISO string or parsable date
  palettePrimary?: string;
  paletteBackground?: string;
}

export function EventCountdown({ targetDate, palettePrimary, paletteBackground }: Props) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPast: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="py-4 text-xs uppercase tracking-widest opacity-80 font-serif italic">
        The celebration is underway!
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 my-6">
      {units.map((u, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center w-16 sm:w-20 py-2.5 sm:py-3 border border-current/25 bg-current/[0.03]"
        >
          <span className="font-serif text-2xl sm:text-3xl font-light tracking-tight leading-none">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-70 mt-1">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
