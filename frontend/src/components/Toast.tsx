import { useEffect, useState } from 'react';

export function Toast() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const handler = (event: Event) => {
      const msg = (event as CustomEvent<string>).detail;
      setMessage(msg);
      window.setTimeout(() => setMessage(null), 2400);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);
  return message ? <div className="alert-stack"><div className="alert alert-success">{message}</div></div> : null;
}
