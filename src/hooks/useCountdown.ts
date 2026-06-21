import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function compute(targetMs: number): Countdown {
  let d = targetMs - Date.now();
  if (d < 0) d = 0;
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d % 86400000) / 3600000),
    minutes: Math.floor((d % 3600000) / 60000),
    seconds: Math.floor((d % 60000) / 1000),
  };
}

/** Тикающий обратный отсчёт до целевой даты (ISO). Обновляется раз в секунду. */
export function useCountdown(targetIso: string): Countdown {
  const targetMs = new Date(targetIso).getTime();
  const [value, setValue] = useState<Countdown>(() => compute(targetMs));
  useEffect(() => {
    setValue(compute(targetMs));
    const id = setInterval(() => setValue(compute(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return value;
}
