import { useMemo, useState } from "react";
import { Search, User, Shield, Flag, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BanRecord, ReportRecord } from "@/hooks/useServerData";
import { renderCodName, stripCodColors } from "@/lib/codColors";
import { formatDate, formatTimeRemaining, isActive, isPermanent } from "@/lib/banUtils";
import { cn } from "@/lib/utils";

interface Props {
  bans: BanRecord[];
  reports: ReportRecord[];
}

export function PlayerLookup({ bans, reports }: Props) {
  const [q, setQ] = useState("");

  const result = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return null;
    const matchedBans = bans.filter(
      (b) =>
        stripCodColors(b.name).toLowerCase().includes(term) || b.ip.includes(term),
    );
    const matchedReports = reports.filter(
      (r) =>
        stripCodColors(r.reportedName).toLowerCase().includes(term) ||
        r.reportedIp.includes(term),
    );
    return { bans: matchedBans, reports: matchedReports };
  }, [q, bans, reports]);

  return (
    <div className="cyber-frame p-5">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-primary neon-icon" />
        <h3 className="font-display text-sm font-black uppercase tracking-[0.2em]">
          Player Lookup
        </h3>
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        // Search by name or IP — see full ban + report history
      </p>

      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary neon-icon" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="player name or IP address"
          className="border-primary/30 bg-background/60 pl-10 font-mono text-sm focus-visible:ring-primary"
        />
      </div>

      {!result ? (
        <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground">
          // Enter at least 2 characters
        </p>
      ) : result.bans.length === 0 && result.reports.length === 0 ? (
        <div className="cyber-frame-sm mt-4 bg-primary/5 p-4 text-center">
          <p className="font-display text-sm font-bold text-primary neon-text-soft">CLEAN RECORD</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            // No bans or reports found
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {result.bans.map((b) => {
            const perm = isPermanent(b);
            const active = isActive(b);
            return (
              <div key={b.id} className="cyber-frame-sm bg-background/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-destructive neon-icon-red" />
                    <span className="font-display text-sm font-bold">
                      {renderCodName(b.name)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold uppercase tracking-[0.15em]",
                      perm ? "text-destructive" : active ? "text-gold" : "text-muted-foreground",
                    )}
                  >
                    {perm ? "PERM" : active ? formatTimeRemaining(b) : "EXPIRED"}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {b.ip} • by <span className="text-primary">{b.admin}</span> • {formatDate(b.bannedAt)}
                </p>
                <p className="mt-1 text-xs text-foreground">{b.reason}</p>
              </div>
            );
          })}
          {result.reports.map((r) => (
            <div key={r.id} className="cyber-frame-sm bg-background/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Flag className="h-3.5 w-3.5 text-gold neon-icon-gold" />
                  <span className="font-display text-sm font-bold">
                    {renderCodName(r.reportedName)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(r.reportedAt)}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                {r.reportedIp} • reported by <span className="text-primary">{r.reporter}</span>
              </p>
              <p className="mt-1 text-xs text-foreground">{r.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
