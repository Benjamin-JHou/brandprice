import { useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { Product } from '../lib/types';

export function useProduct(sku: string | undefined) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sku) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .product(sku)
      .then((p) => {
        if (!cancelled) setData(p);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sku]);

  const refresh = useCallback(() => {
    if (!sku) return;
    setRefreshing(true);
    setError(null);
    api
      .product(sku)
      .then((p) => setData(p))
      .catch((e) => setError(e.message))
      .finally(() => setRefreshing(false));
  }, [sku]);

  return { data, loading, refreshing, error, refresh };
}
