import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BanRecord {
  id: string;
  ip: string;
  admin: string;
  name: string;
  durationSeconds: number;
  bannedAt: number;
  reason: string;
  proofUrl?: string;
}

export interface ReportRecord {
  id: string;
  reporter: string;
  reporterIp: string;
  reportedName: string;
  reportedIp: string;
  reason: string;
  reportedAt: number;
}

interface ServerData {
  bans: BanRecord[];
  reports: ReportRecord[];
  fetchedAt: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const CACHE_KEY = "server-data-cache";
const REFRESH_MS = 60_000; // 1 minute

interface CacheShape {
  bans: BanRecord[];
  reports: ReportRecord[];
  fetchedAt: number;
}

function loadCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useServerData(): ServerData {
  const cached = loadCache();
  const [bans, setBans] = useState<BanRecord[]>(cached?.bans ?? []);
  const [reports, setReports] = useState<ReportRecord[]>(cached?.reports ?? []);
  const [fetchedAt, setFetchedAt] = useState<number | null>(cached?.fetchedAt ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fnError } = await supabase.functions.invoke("fetch-server-data");
      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || "Unknown error");
      setBans(data.bans ?? []);
      setReports(data.reports ?? []);
      const ts = data.fetchedAt ?? Math.floor(Date.now() / 1000);
      setFetchedAt(ts);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ bans: data.bans, reports: data.reports, fetchedAt: ts }),
      );
    } catch (err) {
      console.error("[useServerData] fetch failed:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch live data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(i);
  }, [fetchData]);

  return { bans, reports, fetchedAt, loading, error, refresh: fetchData };
}
