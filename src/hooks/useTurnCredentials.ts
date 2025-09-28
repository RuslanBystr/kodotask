import { useCallback, useEffect, useRef, useState } from 'react';

async function hmacSha1Base64(secret: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-1' }, false, [
    'sign',
  ]);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

type Options = {
  host?: string;
  addStun?: boolean;
  enableTLS?: boolean;
};

export function useTurnCredentials(opts: Options = {}) {
  const { host = '91.98.70.58', addStun = true, enableTLS = false } = opts;

  const [iceServers, setIceServers] = useState<RTCIceServer[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolversRef = useRef<Array<() => void>>([]);

  const TTL = 3600;
  const SECRET = '9a79493b4c3c6cd249e5cda343336b48f77a5796a7cb81b1142ad4249fed27a2';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const expiry = Math.floor(Date.now() / 1000) + TTL;
        const username = `${expiry}:dev-user`;
        const credential = await hmacSha1Base64(SECRET, username);

        if (cancelled) return;

        const servers: RTCIceServer[] = [];

        if (enableTLS) {
          servers.push({ urls: `turns:${host}:5349?transport=tcp`, username, credential });
        }

        servers.push({ urls: `turn:${host}:3478?transport=tcp`, username, credential });

        servers.push({ urls: `turn:${host}:3478?transport=udp`, username, credential });

        if (addStun) {
          servers.push({ urls: 'stun:stun.l.google.com:19302' });
        }

        setIceServers(servers);
        setReady(true);
        resolversRef.current.forEach((r) => r());
        resolversRef.current = [];
      } catch {
        setError('Failed to build TURN credentials');
        setIceServers(addStun ? [{ urls: 'stun:stun.l.google.com:19302' }] : []);
        setReady(true);
        resolversRef.current.forEach((r) => r());
        resolversRef.current = [];
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [host, addStun, enableTLS]);

  const ensureReady = useCallback(() => {
    if (ready) return Promise.resolve();
    return new Promise<void>((res) => {
      resolversRef.current.push(res);
    });
  }, [ready]);

  return { iceServers, ready, error, ensureReady };
}
