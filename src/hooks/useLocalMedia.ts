'use client';

import { useCallback, useState } from 'react';

export function useLocalMedia(defaultConstraints: MediaStreamConstraints = { video: true, audio: true }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acquire = useCallback(
    async (constraints: MediaStreamConstraints = defaultConstraints): Promise<MediaStream | null> => {
      try {
        if (stream) return stream;
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(s);
        return s;
      } catch (e) {
        setError('Failed to access camera/mic');
        return null;
      }
    },
    [defaultConstraints, stream],
  );

  const attach = useCallback(
    (video: HTMLVideoElement | null | undefined) => {
      if (!video || !stream) return;
      video.srcObject = stream;
      video.play?.().catch(() => {});
    },
    [stream],
  );

  const release = useCallback(() => {
    try {
      stream?.getTracks().forEach((t) => t.stop());
    } finally {
      setStream(null);
    }
  }, [stream]);

  return {
    stream,
    error,
    acquire,
    attach,
    release,
  };
}
