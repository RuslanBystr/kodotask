import { useCallback, useEffect, useRef, useState } from 'react';

import { useGetIceQuery } from '@/services/turn';

type IceServer = RTCIceServer;

export function useTurnCredentials() {
  const { data, isLoading, error: queryError } = useGetIceQuery();

  const [iceServers, setIceServers] = useState<IceServer[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolversRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    if (data) {
      setIceServers(data.iceServers ?? []);
      setReady(true);
      setError(null);
      resolversRef.current.forEach((r) => r());
      resolversRef.current = [];
    } else if (queryError) {
      setIceServers([]);
      setReady(true);
      setError((queryError as Error).message || 'Failed to fetch ICE servers');
      resolversRef.current.forEach((r) => r());
      resolversRef.current = [];
    } else if (isLoading) {
      setReady(false);
      setError(null);
    }
  }, [data, queryError, isLoading]);

  const ensureTurnReady = useCallback(() => {
    if (ready) return Promise.resolve();
    return new Promise<void>((res) => {
      resolversRef.current.push(res);
    });
  }, [ready]);

  return { iceServers, ready, error, ensureTurnReady };
}
