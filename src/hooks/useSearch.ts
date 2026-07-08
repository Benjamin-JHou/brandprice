import { useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { Product } from '../lib/types';

type State = {
  data: Product[];
  loading: boolean;
  error: string | null;
  elapsedMs: number;
};

export function useSearch(query: string, debounceMs = 300) {
  const [debounced, setDebounced] = useState(query);
  const [state, setState] = useState<State>({ data: [], loading: false, error: null, elapsedMs: 0 });

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), debounceMs);
    return () => clearTimeout(t);
  }, [query, debounceMs]);

  useEffect(() => {
    if (!debounced.trim()) {
      setState({ data: [], loading: false, error: null, elapsedMs: 0 });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .search(debounced, 10)
      .then((res) => {
        if (cancelled) return;
        setState({ data: res.items, loading: false, error: null, elapsedMs: res.elapsedMs });
      })
      .catch((e) => {
        if (cancelled) return;
        setState({ data: [], loading: false, error: e.message, elapsedMs: 0 });
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const refresh = useCallback(() => {
    if (!debounced.trim()) return;
    setState((s) => ({ ...s, loading: true }));
    api.search(debounced, 10).then((res) =>
      setState({ data: res.items, loading: false, error: null, elapsedMs: res.elapsedMs }),
    );
  }, [debounced]);

  return { ...state, query: debounced, refresh };
}
