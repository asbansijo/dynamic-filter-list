import { useState, useEffect, useRef } from "react";

const cache = new Map();

export function useFetch(url) {
  const [data, setData] = useState(cache.get(url) || null);
  const [loading, setLoading] = useState(!cache.has(url));
  const [error, setError] = useState(null);

  // For retry
  const retryRef = useRef(0);

  useEffect(() => {
    if (!url) return;
    if (cache.has(url)) {
      setData(cache.get(url));
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setData(json);
        cache.set(url, json);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [url, retryRef.current]);

  // retry method
  function retry() {
    retryRef.current += 1;
    setLoading(true);
    setError(null);
  }

  return { data, error, loading, retry };
}
