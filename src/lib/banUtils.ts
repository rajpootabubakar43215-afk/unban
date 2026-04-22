import { BanRecord } from "@/hooks/useServerData";

export function isPermanent(ban: BanRecord) {
  return !ban.durationSeconds || ban.durationSeconds <= 0;
}

export function banExpiryUnix(ban: BanRecord) {
  return ban.bannedAt + ban.durationSeconds;
}

export function isActive(ban: BanRecord, now = Math.floor(Date.now() / 1000)) {
  if (isPermanent(ban)) return true;
  return banExpiryUnix(ban) > now;
}

export function formatTimeRemaining(ban: BanRecord, now = Math.floor(Date.now() / 1000)) {
  if (isPermanent(ban)) return "PERMANENT";
  const remaining = banExpiryUnix(ban) - now;
  if (remaining <= 0) return "EXPIRED";
  const d = Math.floor(remaining / 86400);
  const h = Math.floor((remaining % 86400) / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatDate(unix: number) {
  if (!unix) return "Unknown";
  return new Date(unix * 1000).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelative(unix: number, now = Math.floor(Date.now() / 1000)) {
  if (!unix) return "—";
  const diff = now - unix;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
