import { useState, useEffect, useRef } from "react";
import "./SessionTimer.css";

export default function SessionTimer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const start = new Date(startTime).getTime();

    const update = () => {
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    };

    update();
    intervalRef.current = setInterval(update, 1000);

    return () => clearInterval(intervalRef.current);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="session-timer" id="session-timer">
      <div className="timer-ring">
        <svg viewBox="0 0 120 120" className="timer-ring-svg">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--surface-container-highest)"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - (seconds / 60))}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            className="timer-ring-progress"
          />
        </svg>
        <div className="timer-display">
          <span className="timer-digits display-md">
            {pad(hours)}:{pad(minutes)}
          </span>
          <span className="timer-seconds label-lg">:{pad(seconds)}</span>
        </div>
      </div>
    </div>
  );
}
