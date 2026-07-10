import React, { useMemo } from "react";
import { CCard, CCardBody, CCardHeader } from "@coreui/react";

// Default export React component suitable for preview in the canvas.
// Usage:
// <SnowCard title="Shipping Status" snowIntensity={60} className="w-full max-w-md mx-auto">
//   <p>Your card content here...</p>
// </SnowCard>

export default function SnowCard({ title, children, snowIntensity = 40, className = "" }) {
  const flakes = useMemo(() =>
    Array.from({ length: Math.max(0, Math.min(200, snowIntensity)) }).map(() => ({
      left: Math.random() * 100, // percent
      delay: -(Math.random() * 20), // negative so flakes are staggered when component mounts
      duration: 5 + Math.random() * 12, // seconds falling
      size: 4 + Math.random() * 14, // px
      opacity: 0.35 + Math.random() * 0.65, // 0.35 - 1
      sway: -30 + Math.random() * 60, // px horizontal offset for starting transform
    })),
    [snowIntensity]
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Snow CSS - isolated here so component is one-file */}
      <style>{`
        .snow-overlay { pointer-events: none; }
        .flake {
          position: absolute;
          top: -10vh;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 0 6px rgba(255,255,255,0.08) inset;
          transform: translateX(0);
          /* use two animations: fall (variable duration) and sway (short, alternate) */
          animation-name: fall, sway;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
          animation-fill-mode: forwards;
        }

        /* fall: moves from top (negative) to below the viewport */
        @keyframes fall {
          0% { transform: translateY(-10vh); }
          100% { transform: translateY(110vh); }
        }

        /* sway: small horizontal oscillation to make motion natural */
        @keyframes sway {
          0% { transform: translateX(0); }
          50% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }

        /* make card content appear above the snow and readable */
        .snowed-card { position: relative; z-index: 10; }
      `}</style>

      {/* Snow overlay: each flake is an absolutely positioned span */}
      <div className="snow-overlay absolute inset-0 z-30">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="flake"
            style={{
              left: `${f.left}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity,
              // set css variables for per-flake animation timing by using custom properties
              // React requires casting to any for CSS custom properties
            //   ["--dur" as any]: `${f.duration}s`,
            //   ["--delay" as any]: `${f.delay}s`,
              // combine the two animations; fall uses --dur and --delay, sway uses a small duration
              animation: `fall var(--dur) linear var(--delay) infinite, sway 3s ease-in-out var(--delay) infinite alternate`,
              transform: `translateX(${f.sway}px)`,
            }}
          />
        ))}
      </div>

      {/* CoreUI Card content. Keep the card above the snow with z-index. */}
      <div className="snowed-card">
        <CCard className="bg-white/60 backdrop-blur-sm">
          {title && <CCardHeader className="font-semibold">{title}</CCardHeader>}
          <CCardBody>{children}</CCardBody>
        </CCard>
      </div>
    </div>
  );
}
