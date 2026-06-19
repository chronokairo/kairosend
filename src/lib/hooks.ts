"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, useApi } from "./api";

interface ListState<T> {
  data: T[];
  loading: boolean;
  error: ApiError | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  reload: () => void;
}

/** Cursor-paginated list fetcher (forward pagination via `after`). */
export function useList<T extends { id: string }>(path: string | null, limit = 30): ListState<T> {
  const api = useApi();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(Boolean(path));
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const reqId = useRef(0);

  const load = useCallback(
    async (after?: string) => {
      if (!path) return;
      const id = ++reqId.current;
      try {
        if (after) setLoadingMore(true);
        else setLoading(true);
        const sep = path.includes("?") ? "&" : "?";
        const url = `${path}${sep}limit=${limit}${after ? `&after=${after}` : ""}`;
        const res = await api.get<{ object: "list"; has_more: boolean; data: T[] }>(url);
        if (id !== reqId.current) return;
        setHasMore(res.has_more);
        setData((prev) => (after ? [...prev, ...res.data] : res.data));
        setError(null);
      } catch (err) {
        if (id !== reqId.current) return;
        setError(err instanceof ApiError ? err : null);
      } finally {
        if (id === reqId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [api, path, limit],
  );

  useEffect(() => {
    setData([]);
    setHasMore(false);
    load();
  }, [load]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    const last = data[data.length - 1];
    if (last) load(last.id);
  }, [data, hasMore, loadingMore, load]);

  return { data, loading, error, hasMore, loadingMore, loadMore, reload: () => load() };
}

/** Single-resource fetcher. */
export function useGet<T>(path: string | null) {
  const api = useApi();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    api
      .get<T>(path)
      .then((res) => {
        if (active) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof ApiError ? err : null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, path]);

  return { data, loading, error };
}
