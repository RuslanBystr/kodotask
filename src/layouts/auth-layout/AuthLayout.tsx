import { FC, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: FC = () => {
  const blobs = useMemo(
    () =>
      Array.from({ length: 30 }).map(() => ({
        id: crypto.randomUUID(),
        size: 30 + Math.random() * 50,
        hue: Math.floor(180 + Math.random() * 60),
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 10,
      })),
    [],
  );

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center px-4 md:px-6 overflow-hidden bg-gradient-to-br from-[#1B576C] via-[#07293F] to-[#011827]">
      {blobs.map(({ id, size, hue, top, left, delay, duration }) => (
        <div
          key={id}
          className="absolute rounded-full animate-drift"
          style={{
            width: `${size}px`,
            aspectRatio: '1 / 1',
            top: `${top}%`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            backgroundImage: `radial-gradient(circle at 30% 30%, hsla(${hue}, 100%, 80%, 0.25), transparent 70%)`,
            filter: 'blur(10px)',
            opacity: 0.6,
            willChange: 'transform',
            zIndex: 1,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
};
