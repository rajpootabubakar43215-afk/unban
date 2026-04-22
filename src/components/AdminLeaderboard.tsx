import { useMemo } from "react";
import { Crown, Shield } from "lucide-react";
import { BanRecord } from "@/hooks/useServerData";
import { cn } from "@/lib/utils";

export function AdminLeaderboard({ bans }: { bans: BanRecord[] }) {
  const leaderboard = useMemo(() => {
    const map = new Map<string, { admin: string; count: number; perma: number; lastBan: number }>();
    for (const b of bans) {
      const cur = map.get(b.admin) ?? { admin: b.admin, count: 0, perma: 0, lastBan: 0 };
      cur.count++;
      if (!b.durationSeconds) cur.perma++;
      if (b.bannedAt > cur.lastBan) cur.lastBan = b.bannedAt;
      map.set(b.admin, cur);
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  }, [bans]);

  if (leaderboard.length === 0) {
    return (
      <div className="cyber-frame p-6">
        <Header />
        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
          // No admin activity recorded yet
        </p>
      </div>
    );
  }

  const max = leaderboard[0].count;

  return (
    <div className="cyber-frame p-5">
      <Header />
      <div className="mt-4 space-y-2">
        {leaderboard.map((row, i) => (
          <div key={row.admin} className="cyber-frame-sm bg-background/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center font-display text-xs font-black",
                    i === 0
                      ? "bg-gold/20 text-gold neon-text-soft"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {i === 0 ? <Crown className="h-3.5 w-3.5" /> : `#${i + 1}`}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-foreground">
                    {row.admin}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {row.perma} perm // {row.count - row.perma} temp
                  </p>
                </div>
              </div>
              <span className="font-display text-2xl font-black tabular-nums text-primary neon-text">
                {row.count}
              </span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden bg-background/60">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/40 shadow-[0_0_8px_hsl(var(--primary))]"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-2">
      <Shield className="h-4 w-4 text-primary neon-icon" />
      <h3 className="font-display text-sm font-black uppercase tracking-[0.2em] text-foreground">
        Admin Leaderboard
      </h3>
    </div>
  );
}
