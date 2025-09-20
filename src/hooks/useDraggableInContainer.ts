import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type Options = {
  initial?: { x?: number; y?: number };
  marginX?: number;
  marginY?: number;
  persistKey?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function useDraggableInContainer<T extends HTMLElement = HTMLDivElement>(
  containerRef: React.RefObject<HTMLElement>,
  opts: Options = {},
) {
  const nodeRef = useRef<T | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const startRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const marginX = opts.marginX ?? 12;
  const marginY = opts.marginY ?? 12;

  useLayoutEffect(() => {
    const parent = containerRef.current;
    const node = nodeRef.current;
    if (!parent || !node) return;

    const applyPos = (x: number, y: number) => {
      const maxX = parent.clientWidth - node.clientWidth - marginX;
      const maxY = parent.clientHeight - node.clientHeight - marginY;
      setPos({
        x: clamp(x, marginX, Math.max(marginX, maxX)),
        y: clamp(y, marginY, Math.max(marginY, maxY)),
      });
    };

    if (opts.persistKey) {
      try {
        const raw = localStorage.getItem(opts.persistKey);
        if (raw) {
          const saved = JSON.parse(raw) as { x: number; y: number };
          applyPos(saved.x, saved.y);
          return;
        }
      } catch {
        /* ignore */
      }
    }

    if (typeof opts.initial?.x === 'number' && typeof opts.initial?.y === 'number') {
      applyPos(opts.initial.x, opts.initial.y);
      return;
    }

    // За замовчуванням — top-right
    const x = parent.clientWidth - node.clientWidth - marginX;
    const y = marginY;
    applyPos(x, y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  useLayoutEffect(() => {
    if (!opts.persistKey) return;
    try {
      localStorage.setItem(opts.persistKey, JSON.stringify(pos));
    } catch {
      /* ignore */
    }
  }, [opts.persistKey, pos]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const parent = containerRef.current;
      const node = nodeRef.current;
      if (!parent || !node) return;

      (e.target as Element).setPointerCapture?.(e.pointerId);
      draggingRef.current = true;

      startRef.current = { x: pos.x, y: pos.y };
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    },
    [containerRef, pos.x, pos.y],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const parent = containerRef.current;
      const node = nodeRef.current;
      if (!parent || !node) return;

      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;

      const nextX = startRef.current.x + dx;
      const nextY = startRef.current.y + dy;

      const maxX = parent.clientWidth - node.clientWidth - marginX;
      const maxY = parent.clientHeight - node.clientHeight - marginY;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        setPos({
          x: clamp(nextX, marginX, Math.max(marginX, maxX)),
          y: clamp(nextY, marginY, Math.max(marginY, maxY)),
        });
      });
    },
    [containerRef, marginX, marginY],
  );

  const onPointerUp = useCallback((e: PointerEvent) => {
    draggingRef.current = false;
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  useLayoutEffect(() => {
    const onMove = (ev: PointerEvent) => onPointerMove(ev);
    const onUp = (ev: PointerEvent) => onPointerUp(ev);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [onPointerMove, onPointerUp]);

  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    touchAction: 'none',
    cursor: 'grab',
  };

  return { nodeRef, style, onPointerDown } as const;
}
