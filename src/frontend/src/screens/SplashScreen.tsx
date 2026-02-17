import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    setFadeIn(true);
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[oklch(0.25_0.05_240)] to-[oklch(0.15_0.03_240)]"
      style={{
        backgroundImage: 'url(/assets/generated/athena-splash-bg.dim_1080x1920.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={`flex flex-col items-center gap-6 transition-opacity duration-1000 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src="/assets/generated/athena-logo.dim_512x512.png"
          alt="ATHENA SURVEILLANCE"
          className="w-32 h-32 object-contain"
        />
        <h1 className="text-4xl font-bold text-white tracking-wide">
          ATHENA SURVEILLANCE
        </h1>
      </div>
    </div>
  );
}
