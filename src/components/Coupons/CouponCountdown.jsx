import { useEffect, useState } from "react";

function split(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

/** Cuenta regresiva real, calculada contra Date.now() en cada tick. */
export default function CouponCountdown({ targetAt }) {
  const [remaining, setRemaining] = useState(() => targetAt - Date.now());

  useEffect(() => {
    setRemaining(targetAt - Date.now());
    const timer = setInterval(() => setRemaining(targetAt - Date.now()), 1000);
    return () => clearInterval(timer);
  }, [targetAt]);

  const { hours, minutes, seconds } = split(remaining);
  const units = [
    ["Horas", hours],
    ["Min", minutes],
    ["Seg", seconds],
  ];

  return (
    <div
      className="vale-countdown"
      role="timer"
      aria-label={`Faltan ${hours} horas, ${minutes} minutos y ${seconds} segundos`}
    >
      {units.map(([label, value]) => (
        <div key={label} className="vale-countdown-cell" aria-hidden="true">
          <strong>{pad(value)}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
